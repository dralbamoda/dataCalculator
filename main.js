let currentValues = {
	web: 300,
	social: 200,
	emails: 250,
	music: 1000,
	video: 5000,
	tv: 100000,
	apps: 500
};
const cpg = 0.5;
const platformFee = 1.99;
const values = document.querySelectorAll(".data");
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
			const opt = document.createElement("div");
			opt.textContent = o.label;
			mockList.appendChild(opt);
		});
		list.parentElement.appendChild(mockList);
	});
};

const setRanges = (event) => {
	const id = event.target.id;
	const thisValue = parseInt(event.target.value);
	currentValues[id] = thisValue;
	setValue();
};

const setValue = () => {
	const currentValue = Object.values(currentValues).reduce(
		(acc, v) => acc + v,
		0
	);
	const dataInGB = currentValue / 1000;
	collector.textContent = `${dataInGB.toFixed(2)}GB`;
	hero.textContent = `${dataInGB.toFixed(2)}`;
	const degrees = ((dataInGB * 100) / 239.75) * 3.6;
	topGraph.style.setProperty("--amount", `${degrees > 358 ? 358 : degrees}deg`);
	const textPrice = textValues
		? parseFloat(Object.values(textValues).find((v) => v.checked).value)
		: 0;
	const optimiser = optimiserValues
		? Object.values(optimiserValues).find((v) => v.checked)?.value || 0
		: 0;
	const costPerGig = dataInGB * cpg;
	const totalCost = costPerGig + textPrice + platformFee;
	totalPrice.textContent = `${totalCost.toFixed(2)}`;
};

values.forEach((v) => v.addEventListener("input", setRanges));
textValues.forEach((v) => v.addEventListener("click", setValue));
optimiserValues.forEach((v) => v.addEventListener("click", setValue));

// because safari
mockDataLists();
setValue();
