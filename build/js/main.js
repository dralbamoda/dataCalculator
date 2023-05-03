fetch("./data/data.json")
  .then((response) => response.json())
  .then((data) => {
    let currentValues = {};
    currentValues = data.calculator.sliders.map((slider) => ({
      id: slider.id,
      value: slider.value,
      scale: slider.scale,
    }));

    const totalValue =
      data.calculator.sliders.reduce(
        (acc, v) => acc + v.options[v.options.length - 1].value,
        0
      ) / 1024;

    const cpg = 0.5;
    const platformFee = 1.99;
    const values = document.querySelectorAll(".data");
    const periods = document.querySelectorAll(".period");
    const textValues = document.querySelectorAll(".data-text");
    const optimiserValues = document.querySelectorAll(".data-optimiser");
    const topGraph = document.querySelector(".calculator__graph");
    const collector = document.querySelector("#total");
    const totalPrice = document.querySelector("#total-price");
    const hero = document.querySelector("#hero");

    const mockDataLists = () => {
      const lists = document.querySelectorAll("datalist");
      lists.forEach((list) => {
        const mockList = document.createElement("div");
        mockList.classList.add("calculator__datalist-mock");
        const data = list.children;
        Object.values(data).forEach((o) => {
          const dailyOptionLabel = o.getAttribute('data-dailylabel');
          console.info()
          const opt = document.createElement("div");
          opt.textContent = o.label;
          opt.setAttribute("data-value", o.value);
          opt.setAttribute("data-label", o.label);
          opt.setAttribute("data-dailyLabel", dailyOptionLabel);
          mockList.appendChild(opt);
        });
        list.parentElement.appendChild(mockList);
      });
    };

    const updateRangeValues = (id, value) => {
      const slider = document.querySelector(`#${id}`);
      const section = slider.parentElement.querySelector('.calculator__datalist-mock');
      Array.from(section.children).forEach((c) => {
        const label = c.getAttribute("data-label");
        const dailyLabel = c.getAttribute("data-dailylabel");
        c.textContent = value === 1 ? label : dailyLabel;
      });
    }

    const setRanges = (event) => {
      const id = event.target.id;
      const thisValue = parseInt(event.target.value);

      const thisStoreValue = currentValues.find((cv) => cv.id === id);
      if (thisStoreValue) {
        thisStoreValue.value = thisValue;
      }
      setValue();
    };

    const setPeriod = (event) => {
      const id = event.target.name.replace("unit-", "").replace("[]", "");
      const value = parseInt(event.target.value);
      updateRangeValues(id, value);

      const thisStoreValue = currentValues.find((cv) => cv.id === id);
      if (thisStoreValue) {
        thisStoreValue.scale = value;
      }
      console.table(currentValues);
      setValue();
    };

    const getCost = (dataInGB) => {
      const textPrice = textValues
        ? parseFloat(Object.values(textValues).find((v) => v.checked).value)
        : 0;
      const costPerGig = dataInGB * cpg;
      return costPerGig + textPrice + platformFee;
    };

    const getDegrees = (dataInGB) => {
      return (dataInGB / totalValue) * 360;
    };

    const setValue = (animate = false) => {
      const currentValue = Object.values(currentValues).reduce(
        (acc, v) => acc + v.value,// * v.scale
        0
      );
      const dataInGB = currentValue / 1024;
      collector.textContent = `${dataInGB.toFixed(2)}GB`;
      hero.textContent = `${dataInGB.toFixed(2)}`;
      const degrees = getDegrees(dataInGB);
      topGraph.style.setProperty(
        "--amount",
        `${degrees > 358 ? 358 : degrees}deg`
      );
      totalPrice.textContent = `${getCost(dataInGB).toFixed(2)}`;
      const optimiser = optimiserValues
        ? Object.values(optimiserValues).find((v) => v.checked)?.value || 0
        : 0;

      let total = 0;
      if (animate) {
        const animatedInterval = setInterval(() => {
          if (total < dataInGB) {
            collector.textContent = `${total.toFixed(2)}GB`;
            totalPrice.textContent = `${getCost(total).toFixed(2)}`;
            hero.textContent = `${total.toFixed(2)}`;
            topGraph.style.setProperty(
              "--amount",
              `${getDegrees(total) > 358 ? 358 : getDegrees(total)}deg`
            );
            total++;
          } else {
            clearInterval(animatedInterval);
            collector.textContent = `${dataInGB.toFixed(2)}GB`;
            totalPrice.textContent = `${getCost(dataInGB).toFixed(2)}`;
            hero.textContent = `${dataInGB.toFixed(2)}`;
            topGraph.style.setProperty(
              "--amount",
              `${degrees > 358 ? 358 : degrees}deg`
            );
          }
        }, 1);
      }
    };

    values.forEach((v) => v.addEventListener("input", setRanges));
    periods.forEach((v) => v.addEventListener("change", setPeriod));
    textValues.forEach((v) => v.addEventListener("click", setValue));
    optimiserValues.forEach((v) =>
      v.addEventListener("click", (e) => {
        setValue(e);
        document
          .querySelector(".calculator__help-text-panel")
          .classList.toggle("closed");
      })
    );

    // because safari
    mockDataLists();
    setValue(true);
  });
