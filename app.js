(function () {

    document.querySelector(".copyright").innerHTML = `Copyright © ${ new Date().getFullYear() } <a target="_blank" class="underline" href="https://www.brandymedia.co.uk/">Brandy Media</a>`;

    function copyCat(elem1, elem2, elem3) {
        params = new URLSearchParams(location.search);

        let elem1Input = document.querySelector(elem1);
        let elem2Input = document.querySelector(elem2);
        let elem3Input = params.get(elem3);

        window.addEventListener('load', () => {
            if (elem3Input) {
                elem1Input.value = elem3Input;
                elem2Input.value = elem3Input;
            } else {
                elem1Input.value = elem2Input.value;
            }
            calculate();
        });

        elem2Input.addEventListener('input', () => {
            elem1Input.value = elem2Input.value;
            params.set(elem3, elem2Input.value);
            window.history.replaceState({}, '', `${location.pathname}?${params}`);
            calculate();
        });
        
        elem1Input.addEventListener('input', () => {
            elem2Input.value = elem1Input.value;
            params.set(elem3, elem1Input.value);
            window.history.replaceState({}, '', `${location.pathname}?${params}`);        
            calculate();
        });

        let stepDown = document.querySelector(`${elem1}-slider-step-down`);
        let stepUp = document.querySelector(`${elem1}-slider-step-up`);

        stepDown.addEventListener('click', () => {
            elem2Input.stepDown();
            elem1Input.value = elem2Input.value;
            params.set(elem3, elem2Input.value);
            window.history.replaceState({}, '', `${location.pathname}?${params}`);
            calculate();
        });

        stepUp.addEventListener('click', () => {
            elem2Input.stepUp();
            elem1Input.value = elem2Input.value;
            params.set(elem3, elem2Input.value);
            window.history.replaceState({}, '', `${location.pathname}?${params}`);        
            calculate();
        });
    }

    function thousands_separators(num) {
        var num_parts = num.toString().split(".");
        num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return num_parts.join(".");
    }

    function calculate() {
        const currentRevenue = parseInt(document.querySelector('.current-revenue-input').value);
        const customerTotal = parseInt(document.querySelector('.customer-total-input').value);
        const revenueIncrease = parseInt(document.querySelector('.revenue-increase-input').value);
        const churnRate = parseInt(document.querySelector('.churn-rate-input').value);
        const currentRevenuePeriod = document.querySelector('.current-revenue-period');
        let currentRevenuePeriodOption = currentRevenuePeriod.options[currentRevenuePeriod.selectedIndex].text;
        const revenueIncreaseType = document.querySelector('.revenue-increase-type');
        let revenueIncreaseTypeOption = revenueIncreaseType.options[revenueIncreaseType.selectedIndex].text;
        let revenuePerCustomer;
        let currentTotalRevenue;
        const results = document.querySelector('.results-text');
        const revenueIncreaseFixed = document.querySelector('.revenue-increase-fixed');

        window.addEventListener('load',  () => {
            params = new URLSearchParams(location.search);
            let periodParam = params.get('period');
            let typeParam = params.get('type');
            if (periodParam) {
                currentRevenuePeriod.value = periodParam;
            }
            if (typeParam) {
                revenueIncreaseType.value = typeParam;
            }
            calculate();
        });

        currentRevenuePeriod.addEventListener('change', () => {
            params = new URLSearchParams(location.search);
            params.set('period', currentRevenuePeriod.options[currentRevenuePeriod.selectedIndex].text);
            window.history.replaceState({}, '', `${location.pathname}?${params}`);
            calculate();
        });

        revenueIncreaseType.addEventListener('change', () => {
            params = new URLSearchParams(location.search);
            params.set('type', revenueIncreaseType.options[revenueIncreaseType.selectedIndex].text);
            window.history.replaceState({}, '', `${location.pathname}?${params}`);            
            calculate();
        });

        let currentMonthlyRevenueTotal;
        let currentMonthlyRevenuePerCustomer;
        let currentAnnualRevenueTotal;
        let currentAnnualRevenuePerCustomer;
        
        let projectedMonthlyRevenueIncrease;
        let projectedMonthlyRevenueTotal;
        let projectedMonthlyRevenueTotalPerCustomer;
        let projectedMonthlyRevenueIncreasePerCustomer;
        let projectedAnnualRevenueIncrease;
        let projectedAnnualRevenueTotal;
        let projectedAnnualRevenueTotalPerCustomer;
        let projectedAnnualRevenueIncreasePerCustomer;
        
        let newCustomerTotal;
        let warningText = '';

        if (currentRevenuePeriodOption === 'monthly') {
            currentMonthlyRevenueTotal = currentRevenue;
            currentMonthlyRevenuePerCustomer = currentRevenue / customerTotal;
            currentAnnualRevenueTotal = currentRevenue * 12;
            currentAnnualRevenuePerCustomer = currentAnnualRevenueTotal / customerTotal;
        } else {
            currentMonthlyRevenueTotal = currentRevenue / 12;
            currentMonthlyRevenuePerCustomer = (currentRevenue / customerTotal) / 12;
            currentAnnualRevenueTotal = currentRevenue;
            currentAnnualRevenuePerCustomer = currentAnnualRevenueTotal / customerTotal;
        }

        if (churnRate > 0) {
            newCustomerTotal = customerTotal - ((customerTotal / 100) * churnRate);
        } else {
            newCustomerTotal = customerTotal;
        }

        if (revenueIncreaseTypeOption === 'fixed') {
            projectedMonthlyRevenueTotal = (currentMonthlyRevenuePerCustomer + revenueIncrease) * newCustomerTotal;
            projectedMonthlyRevenueTotalPerCustomer = currentMonthlyRevenuePerCustomer + revenueIncrease;
            projectedAnnualRevenueTotal = projectedMonthlyRevenueTotal * 12;
            projectedAnnualRevenueTotalPerCustomer = projectedMonthlyRevenueTotalPerCustomer * 12;
            revenueIncreaseFixed.classList.remove('hidden');
        } else {
            projectedMonthlyRevenueTotal = (((currentMonthlyRevenuePerCustomer / 100) * revenueIncrease) + currentMonthlyRevenuePerCustomer) * newCustomerTotal;
            projectedMonthlyRevenueTotalPerCustomer = ((currentMonthlyRevenuePerCustomer / 100) * revenueIncrease) + currentMonthlyRevenuePerCustomer;
            projectedAnnualRevenueTotal = projectedMonthlyRevenueTotal * 12;
            projectedAnnualRevenueTotalPerCustomer = projectedMonthlyRevenueTotalPerCustomer * 12;
            revenueIncreaseFixed.classList.add('hidden');
        }

        if (projectedMonthlyRevenueTotal < currentMonthlyRevenueTotal) {
            warningText = `<div class="bg-red-500 text-red-50 mt-5 p-5 flex items-center justify-center">
                <div class="mr-3"><i class="fas fa-exclamation-triangle text-2xl"></i></div>
                <div>Your projected revenue is less than your current revenue.</div>
            </div>`
        }
        
        results.innerHTML = `
            <div class="px-5 md:px-0">
                <h3 class="text-2xl mb-5">Results</h3>
                <p>If you increase your prices by <strong class="text-2xl text-emerald-400">${revenueIncreaseTypeOption === 'fixed' ? `£` : ''}${ revenueIncrease }${revenueIncreaseTypeOption !== 'fixed' ? `%` : ''}</strong> per customer, with an average churn rate of <strong class="text-2xl text-emerald-400">${ churnRate }%</strong>, your projected revenue would be <strong class="text-2xl ${ projectedMonthlyRevenueTotal < currentMonthlyRevenueTotal ? 'text-red-400' : 'text-emerald-400' }">£${ thousands_separators(projectedMonthlyRevenueTotal.toFixed(2)) }</strong> monthly and <strong class="text-2xl ${ projectedMonthlyRevenueTotal < currentMonthlyRevenueTotal ? 'text-red-400' : 'text-emerald-400' }">£${ thousands_separators(projectedAnnualRevenueTotal.toFixed(2)) }</strong> Annually.</p>
            </div>
            ${ warningText }
            <div class="grid grid-cols-2 md:grid-cols-2 gap-0 md:gap-4 mt-10">
                <div class="bg-slate-200 p-5">
                    <h4 class="text-xl font-bold mb-5">Current Revenue</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-slate-50 border border-slate-100 p-5">
                            <h5 class="text-lg mb-5 font-bold">Monthly</h5>
                            <div class="mb-5">
                                <div class="text-sm">Total</div>
                                <div class="text-emerald-400 font-bold text-base md:text-xl">£${ thousands_separators(currentMonthlyRevenueTotal.toFixed(2)) }</div>
                            </div>
                            <div>
                                <div class="text-sm">Per Customer</div>
                                <div class="text-emerald-400 font-bold text-base md:text-xl">£${ thousands_separators(currentMonthlyRevenuePerCustomer.toFixed(2)) }</div>
                            </div>
                        </div>
                        <div class="bg-slate-50 border border-slate-100 p-5">
                            <h5 class="text-lg mb-5 font-bold">Annually</h5>
                            <div class="mb-5">
                                <div class="text-sm">Total</div>
                                <div class="text-emerald-400 font-bold text-base md:text-xl">£${ thousands_separators(currentAnnualRevenueTotal.toFixed(2)) }</div>
                            </div>
                            <div>
                                <div class="text-sm">Per Customer</div>
                                <div class="text-emerald-400 font-bold text-base md:text-xl">£${ thousands_separators(currentAnnualRevenuePerCustomer.toFixed(2)) } </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-slate-200 p-5">
                    <h4 class="text-xl font-bold mb-5">Projected Revenue</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="bg-slate-50 border border-slate-100 p-5">
                            <h5 class="text-lg mb-5 font-bold">Monthly</h5>
                            <div class="mb-5">
                                <div class="text-sm">Total</div>
                                <div class="${ projectedMonthlyRevenueTotal < currentMonthlyRevenueTotal ? 'text-red-400' : 'text-emerald-400' } font-bold text-base md:text-xl">£${ thousands_separators(projectedMonthlyRevenueTotal.toFixed(2)) }</div>
                            </div>
                            <div>
                                <div class="text-sm">Per Customer</div>
                                <div class="text-emerald-400 font-bold text-base md:text-xl">£${ thousands_separators(projectedMonthlyRevenueTotalPerCustomer.toFixed(2)) }</div>
                            </div>
                        </div>
                        <div class="bg-slate-50 border border-slate-100 p-5">
                            <h5 class="text-lg mb-5 font-bold">Annually</h5>
                            <div class="mb-5">
                                <div class="text-sm">Total</div>
                                <div class="${ projectedMonthlyRevenueTotal < currentMonthlyRevenueTotal ? 'text-red-400' : 'text-emerald-400' } font-bold text-base md:text-xl">£${ thousands_separators(projectedAnnualRevenueTotal.toFixed(2)) }</div>
                            </div>
                            <div>
                                <div class="text-sm">Per Customer</div>
                                <div class="text-emerald-400 font-bold text-base md:text-xl">£${ thousands_separators(projectedAnnualRevenueTotalPerCustomer.toFixed(2)) } </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    let printButton = document.querySelector('.print');

    printButton.addEventListener('click', () => {
        window.print();
    });

    let emailButton = document.querySelector('.email');

    emailButton.addEventListener('click', () => {
        let emailLink = encodeURIComponent(window.location.href);
        let subject = document.title;

        var mailToLink = `mailto:?subject=${subject}&body=${emailLink}`;
        window.location.href = mailToLink;
    });

    let shareButton = document.querySelector('.share');

    shareButton.addEventListener('click', () => {
        let tempInput = document.createElement('input');
        tempInput.style = "position: absolute; left: -1000px; top: -1000px";
        tempInput.value = window.location.href;
        document.body.appendChild(tempInput);
        tempInput.select();
        tempInput.setSelectionRange(0, 99999);
        document.execCommand("copy");
        alert(`Copied the shareable link \n${tempInput.value} \nto your clipboard.`);
        document.body.removeChild(tempInput);
    });

    copyCat('.current-revenue-input', '.current-revenue-input-slider-range', 'revenue');
    copyCat('.customer-total-input', '.customer-total-input-slider-range', 'customers');
    copyCat('.revenue-increase-input', '.revenue-increase-input-slider-range', 'increase');
    copyCat('.churn-rate-input', '.churn-rate-input-slider-range', 'churn');
    calculate();
})();