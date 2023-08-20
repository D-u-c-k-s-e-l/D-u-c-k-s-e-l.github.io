function moveColorElement(id) {
	const element = document.getElementById(id);
	const themeColors = document.getElementById("theme-colors");
	themeColors.appendChild(element);
	localStorage.setItem("colorTheme", id)
}

function moveFontElement(id) {
	const element = document.getElementById(id);
	const themeFonts = document.getElementById("theme-fonts");
	themeFonts.appendChild(element);
	localStorage.setItem("fontTheme", id)
}

window.addEventListener("DOMContentLoaded", function () {
	const themeColors = document.getElementById("theme-colors");
	const themeDropdownContent = document.getElementById("color-theme-dropdown-content");
	const elements = themeColors.children;

	for (let i = 0; i < elements.length; i++) {
		const id = elements[i].id;
		const displayName = id.replace(/_/g, " "); // Replace underscores with spaces
		const link = document.createElement("a");
		link.href = "#";
		link.textContent = displayName;
		link.setAttribute("style",
			"color:" + elements[i].style.color + ";background-color:" + elements[i].style.backgroundColor + ";"
			);
		link.addEventListener("click", function () {
			moveColorElement(id);
		});
		themeDropdownContent.appendChild(link);
	}
});

window.addEventListener("DOMContentLoaded", function () {
	const themeFonts = document.getElementById("theme-fonts");
	const themeDropdownContent = document.getElementById("font-theme-dropdown-content");
	const elements = themeFonts.children;

	for (let i = 0; i < elements.length; i++) {
		const id = elements[i].id;
		const displayName = id.replace(/_/g, " "); // Replace underscores with spaces
		const link = document.createElement("a");
		link.href = "#";
		link.textContent = displayName;
		link.setAttribute("style",
		"font-family:" + elements[i].style.fontFamily + ";"
		);
		link.addEventListener("click", function () {
			moveFontElement(id);
		});
		themeDropdownContent.appendChild(link);
	}
});

/* ===== Automatic Theme ===== */
var fontTheme = document.getElementById("theme-fonts").children[
	document.getElementById("theme-fonts").children.length-1].id;
var colorTheme = document.getElementById("theme-colors").children[
	document.getElementById("theme-colors").children.length-1].id;

if (localStorage.getItem("fontTheme")){
	fontTheme = localStorage.getItem("fontTheme")
	moveFontElement(fontTheme)
}
if (localStorage.getItem("colorTheme")) {
	colorTheme = localStorage.getItem("colorTheme")
	moveColorElement(colorTheme)
}

window.addEventListener("DOMContentLoaded", function () {
	if (colorTheme == "PAIN"|localStorage.getItem("PAINT")==10293) {
		let element = document.createElement("span");
		let br = document.createElement("br");

		element.textContent = "You have a PAIN tolerance.";
		element.style = "color: var(--PAIN-pink);background-color: var(--PAIN-bg);";
		document.getElementById("footer-right").appendChild(element);
		document.getElementById("footer-right").appendChild(br);
		localStorage.setItem("PAINT", 10293);
	}
})