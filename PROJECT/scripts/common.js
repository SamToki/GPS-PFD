// For SamToki.github.io
// Released under GNU GPL v3 open source license.
// © 2023 SAM TOKI STUDIO

// Reminders
	// About abbreviations
		// Do not abuse abbreviations. Use only when a word is longer than 8 letters.
		// For example, abbreviate "Animation" into "Anim", but do not abbreviate "Language" into "Lang".
		// Exceptions: "Ctrl", "Cmd", "Avg", etc.

// Initialization
	// Declare variables
	"use strict";
		// Unsaved
		var TheDocument = {
			NavCtrls: document.getElementsByClassName("Nav"),
			Sections: document.getElementsByTagName("section"),
			ActiveSectionID: ""
		},
		System0 = {
			IsPointerDown: false, IsInIMEComposition: false,
			DoNotHide: [0], Dialog: [0],
			ScreenWakeLock: null, PWAInstallation: null
		},
		Automation = {
			ClockRate: 20,
			HighlightActiveSectionInNav: null,
			FadeHotkeyIndicators: null, HideToast: null
		};

		// Saved
		var System = {
			Display: {
				Theme: "Auto", Cursor: "None",
				BlurBgImage: true,
				HotkeyIndicators: "ShowOnAnyKeyPress",
				Anim: 250
			},
			Audio: {
				PlayAudio: true
			},
			I18n: {
				Language: "Auto"
			},
			DontShowAgain: [0],
			Dev: {
				TryToOptimizePerformance: false,
				ShowDebugOutlines: false
			}
		};

// Simplifications
	// Read
		// Element
		function IsElementExisting(ID) {
			return document.getElementById(ID) != null;
		}

		// Class
		function IsClassContained(ID, Class) {
			return document.getElementById(ID).classList.contains(Class);
		}

		// Text & value
		function ReadText(ID) {
			return document.getElementById(ID).innerHTML;
		}
		function ReadValue(ID) {
			return document.getElementById(ID).value;
		}
		function ReadLanguage(ID) {
			return document.getElementById(ID).lang;
		}

		// Position
		function ReadTop(ID) {
			return document.getElementById(ID).offsetTop;
		}
		function ReadLeft(ID) {
			return document.getElementById(ID).offsetLeft;
		}

		// Size
		function ReadWidth(ID) {
			return document.getElementById(ID).offsetWidth;
		}
		function ReadHeight(ID) {
			return document.getElementById(ID).offsetHeight;
		}

		// Layout
		function IsMobileLayout() {
			return window.innerWidth <= 880;
		}
		function IsFullscreen() {
			return document.fullscreenElement != null;
		}

		// Functionality
		function IsChecked(ID) {
			return document.getElementById(ID).checked;
		}
		function IsImageLoaded(ID) {
			return document.getElementById(ID).complete;
		}
		function IsAudioLoaded(ID) {
			return document.getElementById(ID).readyState == 4;
		}

	// Write
		// Element
		function RemoveElement(ID) {
			document.getElementById(ID).remove();
		}

		// Class
		function AddClass(ID, Class) {
			document.getElementById(ID).classList.add(Class);
		}
		function AddClassByClass(Class1, Class2) {
			let Elements = document.getElementsByClassName(Class1);
			for(let Looper = 0; Looper < Elements.length; Looper++) {
				Elements[Looper].classList.add(Class2);
			}
		}
		function RemoveClass(ID, Class) {
			document.getElementById(ID).classList.remove(Class);
		}
		function RemoveClassByClass(Class1, Class2) {
			let Elements = document.getElementsByClassName(Class1);
			if(Class1 != Class2) {
				for(let Looper = 0; Looper < Elements.length; Looper++) {
					Elements[Looper].classList.remove(Class2);
				}
			} else {
				// When removing a class from all elements, Class1 (class to be removed) and Class2 (searching elements with this class) are the same.
				// The array "Elements" will change dynamically as it is based on the removed class, so here we use "while" instead of "for" to avoid omission.
				while(Elements.length > 0) {
					Elements[0].classList.remove(Class2);
				}
			}
		}
		function ChangeIndicatorLight(ID, Value) {
			if(IsClassContained(ID, "IndicatorLight")) {
				RemoveClass(ID, "Off");
				RemoveClass(ID, "Red");
				RemoveClass(ID, "Orange");
				RemoveClass(ID, "Green");
				RemoveClass(ID, "Blue");
				AddClass(ID, Value);
			} else {
				AlertSystemError("Function ChangeIndicatorLight received an element \"" + ID + "\" without class IndicatorLight.");
			}
		}

		// Text & value
		function ChangeText(ID, Text) {
			document.getElementById(ID).innerHTML = Text;
		}
		function AddText(ID, Text) {
			document.getElementById(ID).innerHTML += Text;
		}
		function ChangeValue(ID, Value) {
			document.getElementById(ID).value = Value;
		}
		function ChangePlaceholder(ID, Value) {
			document.getElementById(ID).placeholder = Value;
		}
		function ChangeTooltip(ID, Value) {
			document.getElementById(ID).title = Value;
		}
		function ChangeAriaLabel(ID, Value) {
			document.getElementById(ID).ariaLabel = Value;
		}
		function ChangeLanguage(ID, Value) {
			document.getElementById(ID).lang = Value;
		}
		function ChangeMin(ID, Value) {
			document.getElementById(ID).min = Value;
		}
		function ChangeMax(ID, Value) {
			document.getElementById(ID).max = Value;
		}
		function ChangeStep(ID, Value) {
			document.getElementById(ID).step = Value;
		}
		function ChangeNumberTextbox(ID, Min, Max, Step, Placeholder) {
			ChangeMin(ID, Min);
			ChangeMax(ID, Max);
			ChangeStep(ID, Step);
			ChangePlaceholder(ID, Placeholder);
			ChangeTooltip(ID, Placeholder);
		}

		// Position
		function ChangeTop(ID, Value) {
			document.getElementById(ID).style.top = Value;
		}
		function ChangeLeft(ID, Value) {
			document.getElementById(ID).style.left = Value;
		}
		function ChangeBottom(ID, Value) {
			document.getElementById(ID).style.bottom = Value;
		}
		function ChangeRight(ID, Value) {
			document.getElementById(ID).style.right = Value;
		}
		function ChangeScale(ID, Value) {
			if(Value != "") {
				document.getElementById(ID).style.transform = "scale(" + Value + ")";
			} else {
				document.getElementById(ID).style.transform = "";
			}
		}
		function ChangeRotate(ID, Value) {
			if(Value != "") {
				document.getElementById(ID).style.transform = "rotate(" + Value + "deg)";
			} else {
				document.getElementById(ID).style.transform = "";
			}
		}

		// Size
		function ChangeWidth(ID, Value) {
			document.getElementById(ID).style.width = Value;
		}
		function ChangeHeight(ID, Value) {
			document.getElementById(ID).style.height = Value;
		}

		// Background
		function ChangeBgImage(Value) {
			if(Value != "") {
				document.getElementById("BgImage").style.backgroundImage = "url(" + Value + ")";
			} else {
				document.getElementById("BgImage").style.backgroundImage = "";
			}
		}
		function ChangeImage(ID, Value) {
			document.getElementById(ID).src = Value;
		}
		function ChangeFilter(ID, Value) {
			document.getElementById(ID).style.filter = Value;
		}

		// Foreground
		function ChangeFont(ID, Value) {
			document.getElementById(ID).style.fontFamily = Value;
		}
		function ChangeProgbar(ID, HorizontalOrVertical, Percentage) {
			switch(HorizontalOrVertical) {
				case "Horizontal":
					ChangeWidth(ID, "calc(10px + (100% - 10px) * " + (Percentage / 100) + ")");
					break;
				case "Vertical":
					ChangeHeight(ID, "calc(10px + (100% - 10px) * " + (Percentage / 100) + ")");
					break;
				default:
					AlertSystemError("The value of HorizontalOrVertical \"" + HorizontalOrVertical + "\" in function ChangeProgbar is invalid.");
					break;
			}
		}
		function ChangeShapedProgbar(ID, HorizontalOrVertical, Percentage) {
			switch(HorizontalOrVertical) {
				case "Horizontal":
					document.getElementById(ID).style.clipPath = "inset(0 " + (100 - Percentage) + "% 0 0)";
					break;
				case "Vertical":
					document.getElementById(ID).style.clipPath = "inset(" + (100 - Percentage) + "% 0 0 0)";
					break;
				default:
					AlertSystemError("The value of HorizontalOrVertical \"" + HorizontalOrVertical + "\" in function ChangeShapedProgbar is invalid.");
					break;
			}
		}
		function ChangeProgring(ID, Diameter, Percentage) {
			document.getElementById(ID).style.strokeDasharray = (Math.PI * (Diameter - 5)) * (Percentage / 100) + "px, " + (Math.PI * (Diameter - 5)) * (1 - Percentage / 100) + "px";
		}

		// Layout
		function Show(ID) {
			RemoveClass(ID, "Hidden");
			RemoveClass(ID, "HiddenHorizontally");
			RemoveClass(ID, "HiddenToCorner");
			RemoveClass(ID, "HiddenInMobileLayout");
			RemoveClass(ID, "Faded");
			ChangeInert(ID, false);
			System0.DoNotHide[System0.DoNotHide.length] = ID;
			setTimeout(function() {
				System0.DoNotHide.splice(1, 1);
			}, 20);
		}
		function ShowWithoutProtection(ID) {
			RemoveClass(ID, "Hidden");
			RemoveClass(ID, "HiddenHorizontally");
			RemoveClass(ID, "HiddenToCorner");
			RemoveClass(ID, "HiddenInMobileLayout");
			RemoveClass(ID, "Faded");
			ChangeInert(ID, false);
		}
		function ShowByClass(Class) {
			let Elements = document.getElementsByClassName(Class);
			for(let Looper = 0; Looper < Elements.length; Looper++) {
				Elements[Looper].classList.remove("Hidden");
				Elements[Looper].classList.remove("HiddenHorizontally");
				Elements[Looper].classList.remove("HiddenToCorner");
				Elements[Looper].classList.remove("HiddenInMobileLayout");
				Elements[Looper].classList.remove("Faded");
				Elements[Looper].inert = false;
			}
			System0.DoNotHide[System0.DoNotHide.length] = Class;
			setTimeout(function() {
				System0.DoNotHide.splice(1, 1);
			}, 20);
		}
		function Hide(ID) {
			if(System0.DoNotHide.includes(ID) == false) {
				AddClass(ID, "Hidden");
				ChangeInert(ID, true);
			}
		}
		function HideByClass(Class) {
			if(System0.DoNotHide.includes(Class) == false) {
				let Elements = document.getElementsByClassName(Class);
				for(let Looper = 0; Looper < Elements.length; Looper++) {
					if(System0.DoNotHide.includes(Elements[Looper].id) == false) {
						Elements[Looper].classList.add("Hidden");
						Elements[Looper].inert = true;
					}
				}
			}
		}
		function HideHorizontally(ID) {
			if(System0.DoNotHide.includes(ID) == false) {
				AddClass(ID, "HiddenHorizontally");
				ChangeInert(ID, true);
			}
		}
		function HideToCorner(ID) {
			if(System0.DoNotHide.includes(ID) == false) {
				AddClass(ID, "HiddenToCorner");
				ChangeInert(ID, true);
			}
		}
		function Fade(ID) {
			if(System0.DoNotHide.includes(ID) == false) {
				AddClass(ID, "Faded");
				ChangeInert(ID, true);
			}
		}
		function FadeByClass(Class) {
			if(System0.DoNotHide.includes(Class) == false) {
				let Elements = document.getElementsByClassName(Class);
				for(let Looper = 0; Looper < Elements.length; Looper++) {
					if(System0.DoNotHide.includes(Elements[Looper].id) == false) {
						Elements[Looper].classList.add("Faded");
						Elements[Looper].inert = true;
					}
				}
			}
		}
		function ScrollIntoView(ID) { // The object is the child element.
			document.getElementById(ID).scrollIntoView();
		}
		function ScrollToTop(ID) { // The object is the container.
			document.getElementById(ID).scrollTop = 0;
		}
		function ScrollToBottom(ID) { // The object is the container.
			document.getElementById(ID).scrollTop = document.getElementById(ID).scrollHeight;
		}
		function ToggleFullscreen() {
			if(IsFullscreen() == false) {
				document.body.requestFullscreen();
			} else {
				document.exitFullscreen();
			}
		}

		// Animation
		function ChangeAnim(ID, Value) {
			document.getElementById(ID).style.transition = Value;
		}
		function ChangeAnimOverall(Value) {
			if(Value > 0) {
				document.getElementById("Html").style.transition = Value + "ms, z-index 0ms";
				let AllElements = document.getElementsByTagName("*");
				for(let Looper = 0; Looper < AllElements.length; Looper++) {
					AllElements[Looper].style.animation = "";
				}
				document.getElementById("Html").style.scrollBehavior = "";
			} else {
				document.getElementById("Html").style.transition = "none";
				let AllElements = document.getElementsByTagName("*");
				for(let Looper = 0; Looper < AllElements.length; Looper++) {
					AllElements[Looper].style.animation = "none";
				}
				document.getElementById("Html").style.scrollBehavior = "auto";
			}
		}

		// Functionality
		function ChangeLink(ID, Value) {
			document.getElementById(ID).href = Value;
		}
		function ChangeMediaCondition(ID, Value) {
			document.getElementById(ID).media = Value;
		}
		function ChangeChecked(ID, Value) {
			document.getElementById(ID).checked = Value;
		}
		function ChangeDisabled(ID, Value) {
			document.getElementById(ID).disabled = Value;
		}
		function ChangeInert(ID, Value) {
			document.getElementById(ID).inert = Value;
		}
		function ChangeCursor(ID, Value) {
			document.getElementById(ID).style.cursor = Value;
		}
		function ChangeCursorOverall(Value) {
			let AllElements = document.getElementsByTagName("*");
			for(let Looper = 0; Looper < AllElements.length; Looper++) {
				AllElements[Looper].style.cursor = Value;
			}
		}

		// Audio
		function LoadAudio(ID, Value) { // Value example: "audio/Beep.mp3"
			StopAudio(ID);
			if(System.Audio.PlayAudio && document.getElementById(ID).volume > 0 && Value != "") {
				ChangeText(ID, "<source src=\"" + Value + "\" />");
				document.getElementById(ID).load();
			}
		}
		function PlayAudio(ID, Value) {
			StopAudio(ID);
			if(System.Audio.PlayAudio && document.getElementById(ID).volume > 0) {
				ChangeText(ID, "<source src=\"" + Value + "\" />");
				document.getElementById(ID).load();
				document.getElementById(ID).currentTime = 0;
				document.getElementById(ID).play();
			}
		}
		function StopAudio(ID) {
			document.getElementById(ID).pause();
		}
		function StopAllAudio() {
			let AudioElements = document.getElementsByClassName("Audio");
			for(let Looper = 0; Looper < AudioElements.length; Looper++) {
				AudioElements[Looper].pause();
			}
		}
		function ChangeVolume(ID, Percentage) {
			document.getElementById(ID).volume = Percentage / 100;
		}
		function ChangeAudioLoop(ID, Value) {
			document.getElementById(ID).loop = Value;
		}

	// Interact
	function Click(ID) {
		if(document.getElementById(ID).closest("[inert]") == null) {
			document.getElementById(ID).click();
		}
	}
	function Focus(ID) {
		if(document.getElementById(ID).closest("[inert]") == null) {
			document.getElementById(ID).focus();
		}
	}
	function SelectText(ID) {
		if(document.getElementById(ID).closest("[inert]") == null) {
			document.getElementById(ID).select();
		}
	}

// Cmd
	// General
	function ShowIAmHere(ID) {
		if(System.Display.Anim > 0) {
			setTimeout(function() {
				ChangeAnim(ID, "250ms");
				AddClass(ID, "IAmHere");
			}, 500);
			setTimeout(function() {
				RemoveClass(ID, "IAmHere");
			}, 770);
			setTimeout(function() {
				AddClass(ID, "IAmHere");
			}, 1040);
			setTimeout(function() {
				RemoveClass(ID, "IAmHere");
			}, 1310);
			setTimeout(function() {
				AddClass(ID, "IAmHere");
			}, 1580);
			setTimeout(function() {
				RemoveClass(ID, "IAmHere");
			}, 1850);
			setTimeout(function() {
				ChangeAnim(ID, "");
			}, 2120);
		} else {
			setTimeout(function() {
				AddClass(ID, "IAmHere");
			}, 250);
			setTimeout(function() {
				RemoveClass(ID, "IAmHere");
			}, 500);
			setTimeout(function() {
				AddClass(ID, "IAmHere");
			}, 750);
			setTimeout(function() {
				RemoveClass(ID, "IAmHere");
			}, 1000);
			setTimeout(function() {
				AddClass(ID, "IAmHere");
			}, 1250);
			setTimeout(function() {
				RemoveClass(ID, "IAmHere");
			}, 1500);
		}
	}

	// Settings
		// Display
		function SetTheme() {
			System.Display.Theme = ReadValue("Combobox_SettingsTheme");
			RefreshSystem();
		}
		function SetCursor() {
			System.Display.Cursor = ReadValue("Combobox_SettingsCursor");
			RefreshSystem();
		}
		function SetBlurBgImage() {
			System.Display.BlurBgImage = IsChecked("Checkbox_SettingsBlurBgImage");
			RefreshSystem();
		}
		function SetHotkeyIndicators() {
			System.Display.HotkeyIndicators = ReadValue("Combobox_SettingsHotkeyIndicators");
			RefreshSystem();
		}
		function SetAnim() {
			System.Display.Anim = Number(ReadValue("Combobox_SettingsAnim"));
			RefreshSystem();
		}

		// Audio
		function SetPlayAudio() {
			System.Audio.PlayAudio = IsChecked("Checkbox_SettingsPlayAudio");
			RefreshSystem();
		}

		// I18n
		function SetLanguage() {
			System.I18n.Language = ReadValue("Combobox_SettingsLanguage");
			RefreshSystem();
		}

		// PWA
		function InstallPWA() {
			if(System0.PWAInstallation != null) {
				System0.PWAInstallation.prompt();
			}
		}

		// Dev
		function SetTryToOptimizePerformance() {
			System.Dev.TryToOptimizePerformance = IsChecked("Checkbox_SettingsTryToOptimizePerformance");
			RefreshSystem();
		}
		function SetShowDebugOutlines() {
			System.Dev.ShowDebugOutlines = IsChecked("Checkbox_SettingsShowDebugOutlines");
			RefreshSystem();
		}

// Listeners
	// On scroll
	document.addEventListener("scroll", HighlightActiveSectionInNav);

	// On click (mouse left button, Enter key or Space key)
	document.addEventListener("click", function() {
		setTimeout(HideDropctrlGroups, 0);
		System0.IsPointerDown = false;
	});

	// On mouse button
	document.addEventListener("pointerdown", function() {
		FadeHotkeyIndicators();
		System0.IsPointerDown = true;
	});
	document.addEventListener("pointerup", function() {
		System0.IsPointerDown = false;
	});

	// On Esc key
	document.addEventListener("keydown", function(Hotkey) {
		if(Hotkey.key == "Escape") {
			HideDropctrlGroups();
			if(System0.Dialog.length > 1) {
				setTimeout(function() { // Set a delay for the Esc key event listener in script.js to respond first, so it knows whether a dialog is present, before that dialog gets dismissed.
					AnswerDialog(3);
				}, 0);
			}
		}
	});

	// On IME composition
	document.addEventListener("compositionstart", function() {
		System0.IsInIMEComposition = true;
	})
	document.addEventListener("compositionend", function() {
		System0.IsInIMEComposition = false;
	})

	// On resizing window
	window.addEventListener("resize", function() {
		if(IsMobileLayout() == false) {
			HideHorizontally("Button_Nav");
			ChangeInert("DropctrlGroup_Nav", false);
		} else {
			Show("Button_Nav");
			ChangeInert("DropctrlGroup_Nav", true);
		}
		HideDropctrlGroups();
	});

	// On toggling fullscreen
	document.addEventListener("fullscreenchange", function() { // Here an anonymous function must be used. Because the function "RefreshSystem" is defined in the "script.js" file, which is after this "common.js" file. Writing "RefreshSystem" straightforwardly will cause an error.
		RefreshSystem();
	});

	// Screen wake lock (https://developer.chrome.com/docs/capabilities/web-apis/wake-lock)
	document.addEventListener("visibilitychange", function() {
		if(System0.ScreenWakeLock != null && document.visibilityState == "visible") {
			RequestScreenWakeLock();
		}
	});

	// When PWA installation is available
	window.addEventListener("beforeinstallprompt", function(Event) { // Works on Google Chrome for Android.
		System0.PWAInstallation = Event;
		ChangeDisabled("Button_SettingsInstallPWA", false);
	});

// Features
	// Object checking
	function IsNullInObject(TheObject) {
		return Object.values(TheObject).includes(null);
	}

	// Maths
	function CheckRangeAndCorrect(Number, Min, Max) {
		if(Number < Min) {
			Number = Min;
		}
		if(Number > Max) {
			Number = Max;
		}
		return Number;
	}
	function Randomize(Min, Max) { // Return an integer between two integers.
		return Min + Math.trunc(Math.random() * (Max - Min + 1));
	}
	function DegToRad(Number) {
		return Number * (Math.PI / 180);
	}
	function RadToDeg(Number) {
		return Number / (Math.PI / 180);
	}

	// Highlight active section in nav
	function HighlightActiveSectionInNav() {
		// Automation
		clearTimeout(Automation.HighlightActiveSectionInNav);
		Automation.HighlightActiveSectionInNav = setTimeout(HighlightActiveSectionInNav, 500);

		// Main
		for(let Looper = 0; Looper < TheDocument.Sections.length; Looper++) {
			if(scrollY >= TheDocument.Sections[Looper].offsetTop - 200) {
				TheDocument.ActiveSectionID = TheDocument.Sections[Looper].getAttribute("id");
			}
		}
		for(let Looper = 0; Looper < TheDocument.NavCtrls.length; Looper++) {
			if(TheDocument.NavCtrls[Looper].getAttribute("id") == "Nav_" + TheDocument.ActiveSectionID) {
				if(IsMobileLayout() == false) {
					ChangeTop("Ctrl_NavUnderline", "calc(100% - 2px)");
					ChangeLeft("Ctrl_NavUnderline", TheDocument.NavCtrls[Looper].offsetLeft + 4 + "px");
					ChangeWidth("Ctrl_NavUnderline", TheDocument.NavCtrls[Looper].offsetWidth - 8 + "px");
					ChangeHeight("Ctrl_NavUnderline", "2px");
				} else {
					ChangeTop("Ctrl_NavUnderline", TheDocument.NavCtrls[Looper].offsetTop + 4 + "px");
					ChangeLeft("Ctrl_NavUnderline", "0");
					ChangeWidth("Ctrl_NavUnderline", "2px");
					ChangeHeight("Ctrl_NavUnderline", TheDocument.NavCtrls[Looper].offsetHeight - 8 + "px");
				}
			}
		}
	}

	// Hide DropctrlGroups
	function HideDropctrlGroups() {
		let DropctrlGroups = document.getElementsByClassName("DropctrlGroup");
		for(let Looper = 0; Looper < DropctrlGroups.length; Looper++) {
			if(System0.DoNotHide.includes(DropctrlGroups[Looper].id) == false) {
				if(DropctrlGroups[Looper].id != "DropctrlGroup_Nav") {
					DropctrlGroups[Looper].classList.add("HiddenToCorner");
					DropctrlGroups[Looper].inert = true;
				} else {
					DropctrlGroups[Looper].classList.add("HiddenInMobileLayout");
					if(IsMobileLayout()) {
						DropctrlGroups[Looper].inert = true;
					}
				}
			}
		}
	}

	// Hotkey indicators
	function ShowHotkeyIndicators() {
		switch(System.Display.HotkeyIndicators) {
			case "ShowOnWrongKeyPress":
			case "ShowOnAnyKeyPress":
				ShowByClass("HotkeyIndicator");
				clearTimeout(Automation.FadeHotkeyIndicators);
				Automation.FadeHotkeyIndicators = setTimeout(FadeHotkeyIndicators, System.Display.Anim + 15000);
				break;
			case "AlwaysShow":
				ShowByClass("HotkeyIndicator");
				clearTimeout(Automation.FadeHotkeyIndicators);
				break;
			default:
				AlertSystemError("The value of System.Display.HotkeyIndicators \"" + System.Display.HotkeyIndicators + "\" in function ShowHotkeyIndicators is invalid.");
				break;
		}
	}
	function FadeHotkeyIndicators() {
		if(System.Display.HotkeyIndicators != "AlwaysShow") {
			FadeByClass("HotkeyIndicator");
		}
		clearTimeout(Automation.FadeHotkeyIndicators);
	}
	function IsWrongKeyNegligible(HotkeyName) {
		switch(HotkeyName) {
			case "Control":
			case "Shift":
			case "Alt":
			case "Meta": // Windows key, Linux Super key, macOS Command key.
			case "ContextMenu":
			case "Escape":
			case "Tab":
			case "Enter":
			case " ":
			case "ArrowUp":
			case "ArrowDown":
			case "ArrowLeft":
			case "ArrowRight":
			case "Home":
			case "End":
			case "PageUp":
			case "PageDown":
			case "NumLock":
			case "CapsLock":
			case "ScrollLock":
				return true;
			default:
				return false;
		}
	}

	// Toast
	function ShowToast(Text) {
		ChangeText("Label_Toast", Text);
		ShowWithoutProtection("Toast");
		clearTimeout(Automation.HideToast);
		Automation.HideToast = setTimeout(HideToast, System.Display.Anim + 1000);
	}
	function HideToast() {
		Hide("Toast");
		clearTimeout(Automation.HideToast);
	}

	// Dialog
	function ShowDialog(Event, Icon, Text, CheckboxOption, Option1, Option2, Option3) {
		// Dialog status
		if(Event != "Previous") {
			let IsDialogEventAlreadyExisting = false;
			for(let Looper = 1; Looper < System0.Dialog.length; Looper++) {
				if(System0.Dialog[Looper].Event == Event) {
					IsDialogEventAlreadyExisting = true;
				}
			}
			if(IsDialogEventAlreadyExisting == false) {
				System0.Dialog[System0.Dialog.length] = {
					Event: Event,
					Icon: Icon,
					Text: Text,
					CheckboxOption: CheckboxOption, Option1: Option1, Option2: Option2, Option3: Option3
				}
			}
		} else {
			if(System0.Dialog.length > 1) {
				System0.Dialog.splice(System0.Dialog.length - 1, 1);
			}
			if(System0.Dialog.length <= 1) {
				Fade("ScreenFilter_Dialog");
				Hide("Window_Dialog");
				ChangeInert("Topbar", false);
				ChangeInert("Main", false);
				return;
			}
		}

		// Icon and text
		HideHorizontally("Ctrl_DialogIconInfo");
		HideHorizontally("Ctrl_DialogIconQuestion");
		HideHorizontally("Ctrl_DialogIconCaution");
		HideHorizontally("Ctrl_DialogIconError");
		switch(System0.Dialog[System0.Dialog.length - 1].Icon) {
			case "Info":
				Show("Ctrl_DialogIconInfo");
				break;
			case "Question":
				Show("Ctrl_DialogIconQuestion");
				break;
			case "Caution":
				Show("Ctrl_DialogIconCaution");
				break;
			case "Error":
				Show("Ctrl_DialogIconError");
				break;
			default:
				AlertSystemError("The value of System0.Dialog[System0.Dialog.length - 1].Icon \"" + System0.Dialog[System0.Dialog.length - 1].Icon + "\" in function ShowDialog is invalid.");
				break;
		}
		ChangeText("Label_DialogText", System0.Dialog[System0.Dialog.length - 1].Text);

		// Options
		if(System0.Dialog[System0.Dialog.length - 1].CheckboxOption != "") {
			Show("Ctrl_DialogCheckboxOption");
			ChangeChecked("Checkbox_DialogCheckboxOption", false);
			ChangeText("Label_DialogCheckboxOption", System0.Dialog[System0.Dialog.length - 1].CheckboxOption);
		} else {
			HideHorizontally("Ctrl_DialogCheckboxOption");
		}
		if(System0.Dialog[System0.Dialog.length - 1].Option1 != "") {
			Show("Ctrl_DialogOption1");
			ChangeText("Button_DialogOption1", System0.Dialog[System0.Dialog.length - 1].Option1);
		} else {
			HideHorizontally("Ctrl_DialogOption1");
		}
		if(System0.Dialog[System0.Dialog.length - 1].Option2 != "") {
			Show("Ctrl_DialogOption2");
			ChangeText("Button_DialogOption2", System0.Dialog[System0.Dialog.length - 1].Option2);
		} else {
			HideHorizontally("Ctrl_DialogOption2");
		}
		ChangeText("Button_DialogOption3", System0.Dialog[System0.Dialog.length - 1].Option3); // Option 3 is the default option, will be selected when pressing Esc key. Therefore: When there is a single "OK", put it here. When there are multiple options, put "Cancel" here.

		// Show dialog and disable other ctrls
		Show("ScreenFilter_Dialog");
		Show("Window_Dialog");
		ScrollToTop("Ctrl_DialogText");
		ChangeInert("Topbar", true);
		ChangeInert("Main", true);
	}

	// Screen wake lock
	const RequestScreenWakeLock = async() => {
		System0.ScreenWakeLock = await navigator.wakeLock.request();
	}
	function ReleaseScreenWakeLock() {
		if(System0.ScreenWakeLock != null) {
			System0.ScreenWakeLock.release();
			System0.ScreenWakeLock = null;
		}
	}

// Error handling
window.addEventListener("error", function(ErrorEvent) {
	AlertSystemError(ErrorEvent.message);
});
function ForceStop() {
	// Stop all automations
	Object.keys(Automation).forEach(function(SubobjectName) {
		clearTimeout(Automation[SubobjectName]);
	});

	// Clear dialog events and hide dialog window
	System0.Dialog = [0];
	setTimeout(function() {
		ShowDialog("Previous");
	}, 20);
}
