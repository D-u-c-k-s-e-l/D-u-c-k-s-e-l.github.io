const MAX_PRECEDING_ZEROS_IN_FILENAME = 10

String.prototype.replaceAt = function (index, replacement) {
	return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

async function doesFileExist(urlToFile) {
	let xhr = new XMLHttpRequest();
	xhr.open('HEAD', urlToFile, false);
	xhr.send();

	if (xhr.status == "404") {
		// console.log("File doesn't exist");
		return false;
	} else {
		// console.log("File exists");
		return true;
	}
}

async function trySetComicID(comicId) {
	let failures = 0;
	for (let i = 0; i <= MAX_PRECEDING_ZEROS_IN_FILENAME+1; i++) {
		let filename = "comics/" + '0'.repeat(i) + comicId + ".bmp"
		// console.log(filename)
		let fileExists = await doesFileExist(filename)
		if (fileExists) {
			$(".comic").prop("src", filename)
		} else { failures++ }
	}
	$(".comicContainer").hide().show(0);
	if (failures <= MAX_PRECEDING_ZEROS_IN_FILENAME) {
		return "success!";
	} else {
		return "failure!";
	}
}
async function getLatestComicID() {
	const url = "/comics/latest";
	const response = await fetch(url);
	const text = await response.text();
	return parseInt(text)
}
async function getFirstComicID() {
	const url = "/comics/first";
	const response = await fetch(url);
	const text = await response.text();
	return parseInt(text)
}
function findComicID() {
	return parseInt($(".comic").prop("src").toString().match(/(?<=comics\/)\d*(?=\.bmp)/)[0])
}

const COUNT_FROM = 0;

{ //buttons clicked

	function getZoom() {
		return parseFloat($(".comicContainer").css("--z"));
	}
	function setZoom(zoom) {
		$(".comicContainer").css("--z",zoom )
		const comicElement = document.querySelector('.comic');
		const comicWrapper = document.querySelector('.comicHolder');
		comicWrapper.style.width = `${comicElement.getBoundingClientRect().width}px`;
		comicWrapper.style.height = `${comicElement.getBoundingClientRect().height}px`;
		localStorage.setItem("comicZoomLevel", getZoom())
		$(".comicContainer").hide().show(0);
	}

	$(".comicButtonPlus").on("click", function () {
		let z = getZoom()
		if (z >= 1) {
			setZoom(z+1)
		} else {
			setZoom(1/((1/z)-1))
		}
	})

	$(".comicButtonMinus").on("click", function () {
		let z = getZoom()
		if (z >= 1) {
			setZoom(z - 1)
		} else {
			setZoom(1 / ((1 / z) + 1))
		}
	})

	$(".comicButtonFirst").on("click", function () {
		window.location.href = "/comics?comic=first";
	})

	$(".comicButtonPrevious").on("click", function () {
		console.log("previous: ", findComicID())
		window.location.href = "/comics?comic=" + (findComicID() - 1)
	})

	$(".comicButtonNext").on("click", function () {
		console.log("next")
		window.location.href = "/comics?comic=" + (findComicID() + 1)
	})

	$(".comicButtonLast").on("click", function () {
		console.log("last")
		window.location.href = "/comics"
	})
}


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
{ //on load
	for (let i = 0; i < $(".comicButtonRandom").text().length; i++) {
		if (Math.random() < 0.5) {
			$(".comicButtonRandom").text($(".comicButtonRandom").text().replaceAt(i, $(".comicButtonRandom").text()[i].toUpperCase()))
		} else {
			$(".comicButtonRandom").text($(".comicButtonRandom").text().replaceAt(i, $(".comicButtonRandom").text()[i].toLowerCase()))
		}
	}

	if (urlParams.has("comic")) {
		if (urlParams.get("comic") == "first") {
			getFirstComicID().then((firstComicId) => {
				trySetComicID(firstComicId).then((attempt) => {
					if (attempt == "failure!") {
						console.log("failure loading first, loading most recent")
						$(".comicButtonLast").click()
					}
				});
			})
		} else {
			let comicId = parseInt(urlParams.get("comic")).toString()
			
			trySetComicID(comicId).then((attempt) => {
				if (attempt == "failure!") {
					console.log("failure loading", comicId, ", loading most recent")
					$(".comicButtonLast").click()
				}
			})
		}
	} else {
		getLatestComicID().then((latestComicId) => {
			trySetComicID(latestComicId).then((attempt) => {
				if (attempt == "failure!") {
					console.log("failure loading most recent, loading first")
					$(".comicButtonFirst").click()
				}
			});
		})
	}
}

{ // auto zoom
	var comicZoomLevel = getZoom();
	if (parseFloat(localStorage.getItem("comicZoomLevel"))) {
		comicZoomLevel = parseFloat(localStorage.getItem("comicZoomLevel"))
	}
	window.addEventListener("DOMContentLoaded", function () {
		setTimeout(function () {
			setZoom(comicZoomLevel)
		}, 100)
	})
}