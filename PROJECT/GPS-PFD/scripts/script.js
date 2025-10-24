// For SamToki.github.io/GPS-PFD
// Released under GNU GPL v3 open source license.
// © 2025 SAM TOKI STUDIO

// Initialization
	// Declare variables
	"use strict";
		// Unsaved
		const CurrentVersion = 0.47,
		GeolocationAPIOptions = {
			enableHighAccuracy: true
		};
		var PFD0 = {
			RawData: {
				GPS: {
					Position: {
						Lat: null, Lon: null, Accuracy: null
					},
					Speed: null,
					Altitude: {
						Altitude: null, Accuracy: null
					},
					Heading: null,
					Timestamp: 0
				},
				Accel: {
					Accel: {
						Absolute: {
							X: null, Y: null, Z: null
						},
						AbsoluteWithGravity: {
							X: null, Y: null, Z: null
						},
						Relative: {
							Forward: 0, Right: 0, Upward: 0
						},
						RelativeWithGravity: {
							Forward: 0, Right: 0, Upward: 0
						},
						Aligned: {
							Forward: 0, Right: 0, Upward: 0
						}
					},
					Attitude: {
						Original: {
							Pitch: 0, Roll: 0
						},
						Aligned: {
							Pitch: 0, Roll: 0
						}
					},
					Speed: {
						Vector: {
							Forward: 0, Right: 0, Upward: 0
						},
						Speed: 0
					},
					Altitude: 0,
					Interval: null,
					Timestamp: 0
				},
				Manual: {
					Attitude: {
						Pitch: 0, PitchTrend: 0,
						Roll: 0, RollTrend: 0
					},
					Speed: 0, SpeedTrend: 0,
					Altitude: 0, AltitudeTrend: 0,
					Heading: 0, HeadingTrend: 0
				}
			},
			Status: {
				GPS: {
					IsPositionAvailable: false, IsPositionAccurate: false,
					IsSpeedAvailable: false, IsAltitudeAvailable: false, IsAltitudeAccurate: false, IsHeadingAvailable: false
				},
				IsAccelAvailable: false,
				IsDecisionAltitudeActive: false
			},
			Stats: {
				ClockTime: 0, PreviousClockTime: Date.now(),
				Attitude: {
					Pitch: 0, Pitch2: 0, Roll: 0
				},
				Speed: {
					SampleCount: 0,
					Speed: 0, Vertical: 0, Pitch: 0,
					GS: 0, GSDisplay: 0,
					AvgGS: 0, AvgGSDisplay: 0,
					TAS: 0, TASDisplay: 0,
					Wind: {
						Heading: 0, RelativeHeading: 0 // Wind "heading" is the opposite of wind direction.
					},
					IAS: 0, TapeDisplay: 0, PreviousTapeDisplay: 0, BalloonDisplay: [0, 0, 0, 0],
					Trend: 0, TrendDisplay: 0,
					AvgIAS: 0, AvgIASDisplay: 0,
					MachNumber: 0
				},
				Altitude: {
					Altitude: 0, TapeDisplay: 0, PreviousTapeDisplay: 0, BalloonDisplay: [0, 0, 0, 0, 0],
					Trend: 0, TrendDisplay: 0,
					BeepTimestamp: 0,
					RadioDisplay: 0,
					DecisionTimestamp: 0
				},
				Heading: {
					Heading: 0, Display: 0
				},
				Nav: {
					Lat: 0, Lon: 0,
					Distance: 0, Bearing: 0,
					ETA: 0, LocalizerDeviation: 0, GlideSlopeDeviation: 0, MarkerBeacon: ""
				},
				FlightModeTimestamp: 0
			},
			Alert: {
				Active: {
					SpeedCallout: "", AltitudeCallout: "", AttitudeWarning: "", SpeedWarning: "", AltitudeWarning: ""
				},
				NowPlaying: {
					SpeedCallout: "", AltitudeCallout: "", AttitudeWarning: "", SpeedWarning: "", AltitudeWarning: ""
				}
			}
		};
		Automation.ClockPFD = null;
		Automation.ClockAvgSpeeds = null;

		// Saved
		var Subsystem = {
			Display: {
				PFDStyle: "Default",
				FlipPFDVertically: false,
				KeepScreenOn: false
			},
			Audio: {
				Scheme: "Boeing",
				AttitudeAlertVolume: 100, SpeedAlertVolume: 100, AltitudeAlertVolume: 100
			},
			I18n: {
				AlwaysUseEnglishTerminologyOnPFD: false,
				SpeedUnit: "Knot", DistanceUnit: "NauticalMile", AltitudeUnit: "Feet", VerticalSpeedUnit: "FeetPerMin", TemperatureUnit: "Celsius", PressureUnit: "Hectopascal"
			},
			Dev: {
				VideoFootageMode: false
			}
		},
		PFD = {
			Attitude: {
				IsEnabled: true,
				Mode: "Accel",
				Offset: {
					Pitch: 0, Roll: 0
				}
			},
			Speed: {
				Mode: "GPS",
				IASAlgorithm: "SimpleAlgorithm",
				Wind: {
					Direction: 0, Speed: 0
				},
				TakeOff: {
					V1: 72.016, VR: 74.588
				},
				SpeedLimit: {
					Min: 0, MaxOnFlapsUp: 277.5, MaxOnFlapsFull: 277.5
				}
			},
			Altitude: {
				Mode: "GPS",
				SeatHeight: 3.9624
			},
			Heading: {
				Mode: "GPS"
			},
			Nav: {
				IsEnabled: false,
				ETACalcMethod: "UseAvgGS"
			},
			FlightMode: {
				FlightMode: "DepartureGround",
				AutoSwitchFlightModeAndSwapAirports: true
			},
			WarningSystem: {
				IsEnabled: false
			},
			MCP: {
				Speed: {
					IsEnabled: false, Mode: "IAS", IAS: 0, MachNumber: 0
				},
				Altitude: {
					IsEnabled: false, Value: 0
				},
				VerticalSpeed: {
					IsEnabled: false, Value: 0
				},
				Heading: {
					IsEnabled: false, Value: 0
				}
			},
			Flaps: 0
		},
		AirportLibrary = {
			Selection: {
				Departure: 1, Arrival: 2
			},
			Airport: [
				0,
				{
					Name: "上海虹桥国际机场",
					Region: "中国大陆",
					Code: "SHA",
					Coordinates: {
						Lat: 31.19758, Lon: 121.33438
					},
					Elevation: 4,
					Temperature: 288.15, RelativeHumidity: 50, QNH: 1013.25,
					GlideSlopeAngle: 3,
					MarkerBeaconDistance: {
						Outer: 9260, Middle: 926, Inner: 185.2
					},
					DecisionHeight: 76.2
				},
				{
					Name: "东京国际机场 (羽田机场)",
					Region: "日本",
					Code: "HND",
					Coordinates: {
						Lat: 35.55001, Lon: 139.78635
					},
					Elevation: 4.3,
					Temperature: 288.15, RelativeHumidity: 50, QNH: 1013.25,
					GlideSlopeAngle: 3,
					MarkerBeaconDistance: {
						Outer: 9260, Middle: 926, Inner: 185.2
					},
					DecisionHeight: 76.2
				}
			]
		};

	// Load
	window.onload = Load();
	function Load() {
		// User data
		if(localStorage.System != undefined) {
			System = JSON.parse(localStorage.getItem("System"));
		}
		switch(System.I18n.Language) {
			case "Auto":
				// navigator.languages ...
				break;
			case "en-US":
				/* ChangeCursorOverall("wait");
				window.location.replace("index_en-US.html"); */
				ShowDialog("System_LanguageUnsupported",
					"Caution",
					"<span lang=\"en-US\">Sorry, this webpage currently does not support English (US).</span>",
					"", "", "", "<span lang=\"en-US\">OK</span>");
				break;
			case "ja-JP":
				ShowDialog("System_LanguageUnsupported",
					"Caution",
					"<span lang=\"ja-JP\">すみません。このページは日本語にまだサポートしていません。</span>",
					"", "", "", "<span lang=\"ja-JP\">OK</span>");
				break;
			case "zh-CN":
				break;
			case "zh-TW":
				ShowDialog("System_LanguageUnsupported",
					"Caution",
					"<span lang=\"zh-TW\">抱歉，本網頁暫不支援繁體中文。</span>",
					"", "", "", "<span lang=\"zh-TW\">確定</span>");
				break;
			default:
				AlertSystemError("The value of System.I18n.Language \"" + System.I18n.Language + "\" in function Load is invalid.");
				break;
		}
		if(System.Version.GPSPFD != undefined) {
			if(Math.trunc(CurrentVersion) - Math.trunc(System.Version.GPSPFD) >= 1) {
				ShowDialog("System_MajorUpdateDetected",
					"Info",
					"检测到大版本更新。若您继续使用旧版本的用户数据，则有可能发生兼容性问题。敬请留意。",
					"", "", "", "确定");
				System.Version.GPSPFD = CurrentVersion;
			}
		} else {
			System.Version.GPSPFD = CurrentVersion;
		}
		if(localStorage.GPSPFD_Subsystem != undefined) {
			Subsystem = JSON.parse(localStorage.getItem("GPSPFD_Subsystem"));
		}
		if(localStorage.GPSPFD_PFD != undefined) {
			PFD = JSON.parse(localStorage.getItem("GPSPFD_PFD"));
		}
		if(localStorage.GPSPFD_AirportLibrary != undefined) {
			AirportLibrary = JSON.parse(localStorage.getItem("GPSPFD_AirportLibrary"));
		}

		// Refresh
		HighlightActiveSectionInNav();
		RefreshSystem();
		RefreshSubsystem();
		RefreshPFD();
		RefreshAirportLibrary();
		ClockAvgSpeeds();

		// PWA
		if(navigator.serviceWorker != undefined) {
			navigator.serviceWorker.register("script_ServiceWorker.js").then(function(ServiceWorkerRegistration) {
				// Detect update (https://stackoverflow.com/a/41896649)
				ServiceWorkerRegistration.addEventListener("updatefound", function() {
					const ServiceWorkerInstallation = ServiceWorkerRegistration.installing;
					ServiceWorkerInstallation.addEventListener("statechange", function() {
						if(ServiceWorkerInstallation.state == "installed" && navigator.serviceWorker.controller != null) {
							Show("Label_HelpPWANewVersionReady");
							ShowDialog("System_PWANewVersionReady",
								"Info",
								"新版本已就绪，将在下次启动时生效。",
								"", "", "", "确定");
						}
					});
				});

				// Read service worker status (https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/registration-events/index.html)
				switch(true) {
					case ServiceWorkerRegistration.installing != null:
						ChangeText("Label_SettingsPWAServiceWorkerRegistration", "等待生效");
						break;
					case ServiceWorkerRegistration.waiting != null:
						ChangeText("Label_SettingsPWAServiceWorkerRegistration", "等待更新");
						Show("Label_HelpPWANewVersionReady");
						ShowDialog("System_PWANewVersionReady",
							"Info",
							"新版本已就绪，将在下次启动时生效。",
							"", "", "", "确定");
						break;
					case ServiceWorkerRegistration.active != null:
						ChangeText("Label_SettingsPWAServiceWorkerRegistration", "已生效");
						break;
					default:
						break;
				}
				if(navigator.serviceWorker.controller != null) {
					ChangeText("Label_SettingsPWAServiceWorkerController", "已生效");
				} else {
					ChangeText("Label_SettingsPWAServiceWorkerController", "未生效");
				}
			});
		} else {
			ChangeText("Label_SettingsPWAServiceWorkerRegistration", "不可用");
			ChangeText("Label_SettingsPWAServiceWorkerController", "不可用");
		}

		// Ready
		setTimeout(HideToast, 0);
		if(System.DontShowAgain.includes("GPSPFD_System_Welcome") == false) {
			ShowDialog("System_Welcome",
				"Info",
				"欢迎使用 GPS-PFD。若您是首次使用，请先阅读「使用前须知」。",
				"不再提示", "", "了解更多", "关闭");
		}
	}

// Simplifications
	// Write
		// Class
		function ChangeMarkerBeacon(Value) {
			switch(Subsystem.Display.PFDStyle) {
				case "Default":
					RemoveClass("Ctnr_PFDDefaultPanelMarkerBeacon", "OuterMarker");
					RemoveClass("Ctnr_PFDDefaultPanelMarkerBeacon", "MiddleMarker");
					RemoveClass("Ctnr_PFDDefaultPanelMarkerBeacon", "InnerMarker");
					AddClass("Ctnr_PFDDefaultPanelMarkerBeacon", Value);
					break;
				case "HUD":
					RemoveClass("Ctnr_PFDHUDPanelMarkerBeacon", "OuterMarker");
					RemoveClass("Ctnr_PFDHUDPanelMarkerBeacon", "MiddleMarker");
					RemoveClass("Ctnr_PFDHUDPanelMarkerBeacon", "InnerMarker");
					AddClass("Ctnr_PFDHUDPanelMarkerBeacon", Value);
					break;
				default:
					AlertSystemError("The value of Subsystem.Display.PFDStyle \"" + Subsystem.Display.PFDStyle + "\" in function ChangeMarkerBeacon is invalid.");
					break;
			}
		}

// Refresh
	// Webpage
	function RefreshWebpage() {
		ShowDialog("System_RefreshingWebpage",
			"Info",
			"正在刷新网页...",
			"", "", "", "确定");
		ChangeCursorOverall("wait");
		window.location.reload();
	}

	// System
	function RefreshSystem() {
		// Topbar
		if(IsMobileLayout() == false) {
			HideHorizontally("Button_Nav");
			ChangeInert("DropctrlGroup_Nav", false);
		} else {
			Show("Button_Nav");
			ChangeInert("DropctrlGroup_Nav", true);
		}

		// Fullscreen
		if(IsFullscreen() == false) {
			Show("Topbar");
			ChangeText("Button_PFDToggleFullscreen", "全屏");
		} else {
			Hide("Topbar");
			ChangeText("Button_PFDToggleFullscreen", "退出全屏");
		}

		// Settings
			// Display
			if(window.matchMedia("(prefers-contrast: more)").matches == false) {
				ChangeDisabled("Combobox_SettingsTheme", false);
			} else {
				System.Display.Theme = "HighContrast";
				ChangeDisabled("Combobox_SettingsTheme", true);
			}
			ChangeValue("Combobox_SettingsTheme", System.Display.Theme);
			switch(System.Display.Theme) {
				case "Auto":
					ChangeLink("ThemeVariant_Common", "../styles/common_Dark.css");
					ChangeMediaCondition("ThemeVariant_Common", "(prefers-color-scheme: dark)");
					ChangeLink("ThemeVariant_Style", "styles/style_Dark.css");
					ChangeMediaCondition("ThemeVariant_Style", "(prefers-color-scheme: dark)");
					break;
				case "Light":
					ChangeLink("ThemeVariant_Common", "");
					ChangeMediaCondition("ThemeVariant_Common", "");
					ChangeLink("ThemeVariant_Style", "");
					ChangeMediaCondition("ThemeVariant_Style", "");
					break;
				case "Dark":
					ChangeLink("ThemeVariant_Common", "../styles/common_Dark.css");
					ChangeMediaCondition("ThemeVariant_Common", "");
					ChangeLink("ThemeVariant_Style", "styles/style_Dark.css");
					ChangeMediaCondition("ThemeVariant_Style", "");
					break;
				case "AtelierSophie2":
					ChangeLink("ThemeVariant_Common", "../styles/common_AtelierSophie2.css");
					ChangeMediaCondition("ThemeVariant_Common", "");
					ChangeLink("ThemeVariant_Style", "styles/style_AtelierSophie2.css");
					ChangeMediaCondition("ThemeVariant_Style", "");
					break;
				case "Genshin":
					ChangeLink("ThemeVariant_Common", "../styles/common_Genshin.css");
					ChangeMediaCondition("ThemeVariant_Common", "");
					ChangeLink("ThemeVariant_Style", "styles/style_Genshin.css");
					ChangeMediaCondition("ThemeVariant_Style", "");
					break;
				case "HighContrast":
					ChangeLink("ThemeVariant_Common", "../styles/common_HighContrast.css");
					ChangeMediaCondition("ThemeVariant_Common", "");
					ChangeLink("ThemeVariant_Style", "styles/style_HighContrast.css");
					ChangeMediaCondition("ThemeVariant_Style", "");
					break;
				default:
					AlertSystemError("The value of System.Display.Theme \"" + System.Display.Theme + "\" in function RefreshSystem is invalid.");
					break;
			}
			ChangeValue("Combobox_SettingsCursor", System.Display.Cursor);
			switch(System.Display.Cursor) {
				case "Default":
					ChangeCursorOverall("");
					break;
				case "BTRAhoge":
				case "Genshin":
				case "GenshinFurina":
				case "GenshinNahida":
				case "SilentWitch":
					ChangeCursorOverall("url(../cursors/" + System.Display.Cursor + ".cur), auto");
					break;
				default:
					AlertSystemError("The value of System.Display.Cursor \"" + System.Display.Cursor + "\" in function RefreshSystem is invalid.");
					break;
			}
			ChangeChecked("Checkbox_SettingsBlurBgImage", System.Display.BlurBgImage);
			if(System.Display.BlurBgImage == true) {
				AddClass("BgImage", "Blur");
			} else {
				RemoveClass("BgImage", "Blur");
			}
			ChangeValue("Combobox_SettingsHotkeyIndicators", System.Display.HotkeyIndicators);
			switch(System.Display.HotkeyIndicators) {
				case "Disabled":
					FadeHotkeyIndicators();
					break;
				case "ShowOnWrongKeyPress":
				case "ShowOnAnyKeyPress":
					break;
				case "AlwaysShow":
					ShowHotkeyIndicators();
					break;
				default:
					AlertSystemError("The value of System.Display.HotkeyIndicators \"" + System.Display.HotkeyIndicators + "\" in function RefreshSystem is invalid.");
					break;
			}
			if(window.matchMedia("(prefers-reduced-motion: reduce)").matches == false) {
				ChangeDisabled("Combobox_SettingsAnim", false);
			} else {
				System.Display.Anim = 0;
				ChangeDisabled("Combobox_SettingsAnim", true);
			}
			ChangeValue("Combobox_SettingsAnim", System.Display.Anim);
			ChangeAnimOverall(System.Display.Anim);

			// Audio
			ChangeChecked("Checkbox_SettingsPlayAudio", System.Audio.PlayAudio);
			if(System.Audio.PlayAudio == true) {
				Show("Ctrl_SettingsAudioScheme");
				Show("Label_SettingsAudio");
				Show("Ctrl_SettingsAttitudeAlertVolume");
				Show("Ctrl_SettingsSpeedAlertVolume");
				Show("Ctrl_SettingsAltitudeAlertVolume");
				ChangeValue("Combobox_SettingsAudioScheme", Subsystem.Audio.Scheme);
				ChangeValue("Slider_SettingsAttitudeAlertVolume", Subsystem.Audio.AttitudeAlertVolume);
				if(Subsystem.Audio.AttitudeAlertVolume > 0) {
					ChangeText("Label_SettingsAttitudeAlertVolume", Subsystem.Audio.AttitudeAlertVolume + "%");
				} else {
					ChangeText("Label_SettingsAttitudeAlertVolume", "禁用");
				}
				ChangeVolume("Audio_AttitudeAlert", Subsystem.Audio.AttitudeAlertVolume);
				ChangeValue("Slider_SettingsSpeedAlertVolume", Subsystem.Audio.SpeedAlertVolume);
				if(Subsystem.Audio.SpeedAlertVolume > 0) {
					ChangeText("Label_SettingsSpeedAlertVolume", Subsystem.Audio.SpeedAlertVolume + "%");
				} else {
					ChangeText("Label_SettingsSpeedAlertVolume", "禁用");
				}
				ChangeVolume("Audio_SpeedAlert", Subsystem.Audio.SpeedAlertVolume);
				ChangeValue("Slider_SettingsAltitudeAlertVolume", Subsystem.Audio.AltitudeAlertVolume);
				if(Subsystem.Audio.AltitudeAlertVolume > 0) {
					ChangeText("Label_SettingsAltitudeAlertVolume", Subsystem.Audio.AltitudeAlertVolume + "%");
				} else {
					ChangeText("Label_SettingsAltitudeAlertVolume", "禁用");
				}
				ChangeVolume("Audio_AltitudeAlert", Subsystem.Audio.AltitudeAlertVolume);
			} else {
				StopAllAudio();
				Hide("Ctrl_SettingsAudioScheme");
				Hide("Label_SettingsAudio");
				Hide("Ctrl_SettingsAttitudeAlertVolume");
				Hide("Ctrl_SettingsSpeedAlertVolume");
				Hide("Ctrl_SettingsAltitudeAlertVolume");
			}

			// PWA
			if(window.matchMedia("(display-mode: standalone)").matches == true) {
				ChangeText("Label_SettingsPWAStandaloneDisplay", "是");
			} else {
				ChangeText("Label_SettingsPWAStandaloneDisplay", "否");
			}

			// Dev
			ChangeChecked("Checkbox_SettingsTryToOptimizePerformance", System.Dev.TryToOptimizePerformance);
			if(System.Dev.TryToOptimizePerformance == true) {
				AddClass("Html", "TryToOptimizePerformance");
				Automation.ClockRate = 40;
			} else {
				RemoveClass("Html", "TryToOptimizePerformance");
				Automation.ClockRate = 20;
			}
			ChangeChecked("Checkbox_SettingsShowDebugOutlines", System.Dev.ShowDebugOutlines);
			if(System.Dev.ShowDebugOutlines == true) {
				AddClass("Html", "ShowDebugOutlines");
			} else {
				RemoveClass("Html", "ShowDebugOutlines");
			}
			ChangeChecked("Checkbox_SettingsUseJapaneseGlyph", System.Dev.UseJapaneseGlyph);
			if(System.Dev.UseJapaneseGlyph == true) {
				ChangeLanguage("Html", "ja-JP");
			} else {
				ChangeLanguage("Html", "zh-CN");
			}
			ChangeValue("Textbox_SettingsFont", System.Dev.Font);
			ChangeFont("Html", System.Dev.Font);

			// User data
			ChangeValue("Textbox_SettingsUserDataImport", "");

		// Save user data
		localStorage.setItem("System", JSON.stringify(System));
	}
	function RefreshSubsystem() {
		// Settings
			// Display
			ChangeValue("Combobox_SettingsPFDStyle", Subsystem.Display.PFDStyle);
			HideHorizontally("Ctnr_PFDDefaultPanel");
			HideHorizontally("Ctnr_PFDHUDPanel");
			HideHorizontally("Ctnr_PFDBocchi737Panel");
			HideHorizontally("Ctnr_PFDAnalogGaugesPanel");
			HideHorizontally("Ctnr_PFDAutomobileSpeedometerPanel");
			RemoveClass("PFD", "PFDStyleIsDefault");
			RemoveClass("PFD", "PFDStyleIsHUD");
			RemoveClass("PFD", "PFDStyleIsBocchi737");
			RemoveClass("PFD", "PFDStyleIsAnalogGauges");
			RemoveClass("PFD", "PFDStyleIsAutomobileSpeedometer");
			switch(Subsystem.Display.PFDStyle) {
				case "Default":
					Show("Ctnr_PFDDefaultPanel");
					AddClass("PFD", "PFDStyleIsDefault");
					break;
				case "HUD":
					Show("Ctnr_PFDHUDPanel");
					AddClass("PFD", "PFDStyleIsHUD");
					break;
				case "Bocchi737":
				case "AnalogGauges":
					AlertSystemError("A PFD style which is still under construction was selected.");
					break;
				case "AutomobileSpeedometer":
					Show("Ctnr_PFDAutomobileSpeedometerPanel");
					AddClass("PFD", "PFDStyleIsAutomobileSpeedometer");
					break;
				default:
					AlertSystemError("The value of Subsystem.Display.PFDStyle \"" + Subsystem.Display.PFDStyle + "\" in function RefreshSubsystem is invalid.");
					break;
			}
			ChangeChecked("Checkbox_SettingsFlipPFDVertically", Subsystem.Display.FlipPFDVertically);
			ChangeChecked("Checkbox_PFDOptionsKeepScreenOn", Subsystem.Display.KeepScreenOn);
			ChangeChecked("Checkbox_SettingsKeepScreenOn", Subsystem.Display.KeepScreenOn);
			if(Subsystem.Display.KeepScreenOn == true) {
				RequestScreenWakeLock();
			} else {
				ReleaseScreenWakeLock();
			}

			// Audio
			if(System.Audio.PlayAudio == true) {
				ChangeValue("Combobox_SettingsAudioScheme", Subsystem.Audio.Scheme);
				ChangeValue("Slider_SettingsAttitudeAlertVolume", Subsystem.Audio.AttitudeAlertVolume);
				if(Subsystem.Audio.AttitudeAlertVolume > 0) {
					ChangeText("Label_SettingsAttitudeAlertVolume", Subsystem.Audio.AttitudeAlertVolume + "%");
				} else {
					ChangeText("Label_SettingsAttitudeAlertVolume", "禁用");
				}
				ChangeVolume("Audio_AttitudeAlert", Subsystem.Audio.AttitudeAlertVolume);
				ChangeValue("Slider_SettingsSpeedAlertVolume", Subsystem.Audio.SpeedAlertVolume);
				if(Subsystem.Audio.SpeedAlertVolume > 0) {
					ChangeText("Label_SettingsSpeedAlertVolume", Subsystem.Audio.SpeedAlertVolume + "%");
				} else {
					ChangeText("Label_SettingsSpeedAlertVolume", "禁用");
				}
				ChangeVolume("Audio_SpeedAlert", Subsystem.Audio.SpeedAlertVolume);
				ChangeValue("Slider_SettingsAltitudeAlertVolume", Subsystem.Audio.AltitudeAlertVolume);
				if(Subsystem.Audio.AltitudeAlertVolume > 0) {
					ChangeText("Label_SettingsAltitudeAlertVolume", Subsystem.Audio.AltitudeAlertVolume + "%");
				} else {
					ChangeText("Label_SettingsAltitudeAlertVolume", "禁用");
				}
				ChangeVolume("Audio_AltitudeAlert", Subsystem.Audio.AltitudeAlertVolume);
			}

			// I18n
				// English terminology on PFD
				ChangeChecked("Checkbox_SettingsAlwaysUseEnglishTerminologyOnPFD", Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD);
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					switch(Subsystem.Display.PFDStyle) {
						case "Default":
							ChangeText("Label_PFDDefaultPanelAccelTitle", "加速计");
							ChangeText("Label_PFDDefaultPanelGSTitle", "地速");
							ChangeText("Label_PFDDefaultPanelAvgGSTitle", "平均地速");
							ChangeText("Label_PFDDefaultPanelTASTitle", "真空速");
							ChangeText("Label_PFDDefaultPanelWindTitle", "风");
							ChangeText("Label_PFDDefaultPanelFlapsTitle", "襟翼");
							ChangeText("Label_PFDDefaultPanelSpeedModeTitle", "速度模式");
							ChangeText("Label_PFDDefaultPanelAltitudeModeTitle", "高度模式");
							ChangeText("Label_PFDDefaultPanelHeadingModeTitle", "朝向模式");
							ChangeText("Label_PFDDefaultPanelDMETitle", "测距仪");
							ChangeText("Label_PFDDefaultPanelDecisionAltitudeTitle", "决断高度");
							break;
						case "HUD":
							ChangeText("Label_PFDHUDPanelAccelTitle", "加速计");
							ChangeText("Label_PFDHUDPanelSpeedModeTitle", "速度模式");
							ChangeText("Label_PFDHUDPanelAltitudeModeTitle", "高度模式");
							ChangeText("Label_PFDHUDPanelHeadingModeTitle", "朝向模式");
							ChangeText("Label_PFDHUDPanelSpeedGSTitle", "地速");
							ChangeText("Label_PFDHUDPanelDMETitle", "测距仪");
							ChangeText("Label_PFDHUDPanelDecisionAltitudeTitle", "决断高度");
							break;
						case "Bocchi737":
						case "AnalogGauges":
							AlertSystemError("A PFD style which is still under construction was selected.");
							break;
						case "AutomobileSpeedometer":
							ChangeText("Label_PFDAutomobileSpeedometerPanelSpeedUnit", Translate(Subsystem.I18n.SpeedUnit + "OnPFD"));
							ChangeText("Label_PFDAutomobileSpeedometerPanelDMETitle", "测距仪");
							ChangeText("Label_PFDAutomobileSpeedometerPanelAltitudeTitle", "高度");
							break;
						default:
							AlertSystemError("The value of Subsystem.Display.PFDStyle \"" + Subsystem.Display.PFDStyle + "\" in function RefreshSubsystem is invalid.");
							break;
					}
				} else {
					switch(Subsystem.Display.PFDStyle) {
						case "Default":
							ChangeText("Label_PFDDefaultPanelAccelTitle", "ACCEL");
							ChangeText("Label_PFDDefaultPanelGSTitle", "GS");
							ChangeText("Label_PFDDefaultPanelAvgGSTitle", "AVG GS");
							ChangeText("Label_PFDDefaultPanelTASTitle", "TAS");
							ChangeText("Label_PFDDefaultPanelWindTitle", "WIND");
							ChangeText("Label_PFDDefaultPanelFlapsTitle", "FLAPS");
							ChangeText("Label_PFDDefaultPanelSpeedModeTitle", "SPD MODE");
							ChangeText("Label_PFDDefaultPanelAltitudeModeTitle", "ALT MODE");
							ChangeText("Label_PFDDefaultPanelHeadingModeTitle", "HDG MODE");
							ChangeText("Label_PFDDefaultPanelDMETitle", "DME");
							ChangeText("Label_PFDDefaultPanelDecisionAltitudeTitle", "DA");
							break;
						case "HUD":
							ChangeText("Label_PFDHUDPanelAccelTitle", "ACCEL");
							ChangeText("Label_PFDHUDPanelSpeedModeTitle", "SPD MODE");
							ChangeText("Label_PFDHUDPanelAltitudeModeTitle", "ALT MODE");
							ChangeText("Label_PFDHUDPanelHeadingModeTitle", "HDG MODE");
							ChangeText("Label_PFDHUDPanelSpeedGSTitle", "GS");
							ChangeText("Label_PFDHUDPanelDMETitle", "DME");
							ChangeText("Label_PFDHUDPanelDecisionAltitudeTitle", "DA");
							break;
						case "Bocchi737":
						case "AnalogGauges":
							AlertSystemError("A PFD style which is still under construction was selected.");
							break;
						case "AutomobileSpeedometer":
							ChangeText("Label_PFDAutomobileSpeedometerPanelSpeedUnit", Translate(Subsystem.I18n.SpeedUnit + "OnPFD"));
							ChangeText("Label_PFDAutomobileSpeedometerPanelDMETitle", "DME");
							ChangeText("Label_PFDAutomobileSpeedometerPanelAltitudeTitle", "ALT");
							break;
						default:
							AlertSystemError("The value of Subsystem.Display.PFDStyle \"" + Subsystem.Display.PFDStyle + "\" in function RefreshSubsystem is invalid.");
							break;
					}
				}

				// Units of measurement
					// Presets
					switch(true) {
						case Subsystem.I18n.SpeedUnit == "KilometerPerHour" && Subsystem.I18n.DistanceUnit == "Kilometer" &&
						Subsystem.I18n.AltitudeUnit == "Meter" && Subsystem.I18n.VerticalSpeedUnit == "MeterPerSec" &&
						Subsystem.I18n.PressureUnit == "Hectopascal" && Subsystem.I18n.TemperatureUnit == "Celsius":
							ChangeValue("Combobox_SettingsMeasurementUnitsPreset", "AllMetric");
							break;
						case Subsystem.I18n.SpeedUnit == "Knot" && Subsystem.I18n.DistanceUnit == "NauticalMile" &&
						Subsystem.I18n.AltitudeUnit == "Feet" && Subsystem.I18n.VerticalSpeedUnit == "FeetPerMin" &&
						Subsystem.I18n.PressureUnit == "Hectopascal" && Subsystem.I18n.TemperatureUnit == "Celsius":
							ChangeValue("Combobox_SettingsMeasurementUnitsPreset", "CivilAviation");
							break;
						default:
							ChangeValue("Combobox_SettingsMeasurementUnitsPreset", "");
							break;
					}

					// Speed
					ChangeValue("Combobox_SettingsSpeedUnit", Subsystem.I18n.SpeedUnit);
					switch(Subsystem.I18n.SpeedUnit) {
						case "KilometerPerHour":
							switch(PFD.MCP.Speed.Mode) {
								case "IAS":
									ChangeNumberTextbox("Textbox_PFDMCPSpeed", "0", "999", "1", "0~999");
									break;
								case "MachNumber":
									ChangeNumberTextbox("Textbox_PFDMCPSpeed", "0", "0.999", "0.01", "0~0.999");
									break;
								default:
									AlertSystemError("The value of PFD.MCP.Speed.Mode \"" + PFD.MCP.Speed.Mode + "\" in function RefreshSubsystem is invalid.");
									break;
							}
							ChangeNumberTextbox("Textbox_SettingsWindSpeed", "0", "999", "5", "0~999");
							ChangeNumberTextbox("Textbox_SettingsV1", "0", "999", "5", "0~999");
							ChangeNumberTextbox("Textbox_SettingsVR", "0", "999", "5", "0~999");
							ChangeNumberTextbox("Textbox_SettingsSpeedLimitMin", "0", "980", "5", "0~980");
							ChangeNumberTextbox("Textbox_SettingsSpeedLimitMaxOnFlapsUp", "20", "999", "5", "20~999");
							ChangeNumberTextbox("Textbox_SettingsSpeedLimitMaxOnFlapsFull", "20", "999", "5", "20~999");
							break;
						case "MilePerHour":
							switch(PFD.MCP.Speed.Mode) {
								case "IAS":
									ChangeNumberTextbox("Textbox_PFDMCPSpeed", "0", "621", "1", "0~621");
									break;
								case "MachNumber":
									ChangeNumberTextbox("Textbox_PFDMCPSpeed", "0", "0.999", "0.01", "0~0.999");
									break;
								default:
									AlertSystemError("The value of PFD.MCP.Speed.Mode \"" + PFD.MCP.Speed.Mode + "\" in function RefreshSubsystem is invalid.");
									break;
							}
							ChangeNumberTextbox("Textbox_SettingsWindSpeed", "0", "621", "5", "0~621");
							ChangeNumberTextbox("Textbox_SettingsV1", "0", "621", "5", "0~621");
							ChangeNumberTextbox("Textbox_SettingsVR", "0", "621", "5", "0~621");
							ChangeNumberTextbox("Textbox_SettingsSpeedLimitMin", "0", "609", "5", "0~609");
							ChangeNumberTextbox("Textbox_SettingsSpeedLimitMaxOnFlapsUp", "10", "621", "5", "12~621");
							ChangeNumberTextbox("Textbox_SettingsSpeedLimitMaxOnFlapsFull", "10", "621", "5", "12~621");
							break;
						case "Knot":
							switch(PFD.MCP.Speed.Mode) {
								case "IAS":
									ChangeNumberTextbox("Textbox_PFDMCPSpeed", "0", "539", "1", "0~539");
									break;
								case "MachNumber":
									ChangeNumberTextbox("Textbox_PFDMCPSpeed", "0", "0.999", "0.01", "0~0.999");
									break;
								default:
									AlertSystemError("The value of PFD.MCP.Speed.Mode \"" + PFD.MCP.Speed.Mode + "\" in function RefreshSubsystem is invalid.");
									break;
							}
							ChangeNumberTextbox("Textbox_SettingsWindSpeed", "0", "539", "5", "0~539");
							ChangeNumberTextbox("Textbox_SettingsV1", "0", "539", "5", "0~539");
							ChangeNumberTextbox("Textbox_SettingsVR", "0", "539", "5", "0~539");
							ChangeNumberTextbox("Textbox_SettingsSpeedLimitMin", "0", "529", "5", "0~529");
							ChangeNumberTextbox("Textbox_SettingsSpeedLimitMaxOnFlapsUp", "10", "539", "5", "11~539");
							ChangeNumberTextbox("Textbox_SettingsSpeedLimitMaxOnFlapsFull", "10", "539", "5", "11~539");
							break;
						default:
							AlertSystemError("The value of Subsystem.I18n.SpeedUnit \"" + Subsystem.I18n.SpeedUnit + "\" in function RefreshSubsystem is invalid.");
							break;
					}
					ChangeText("ComboboxOption_PFDMCPSpeedModeIAS", Translate(Subsystem.I18n.SpeedUnit));
					ChangeText("Label_SettingsWindSpeedUnit", Translate(Subsystem.I18n.SpeedUnit));
					ChangeText("Label_SettingsV1Unit", Translate(Subsystem.I18n.SpeedUnit));
					ChangeText("Label_SettingsVRUnit", Translate(Subsystem.I18n.SpeedUnit));
					ChangeText("Label_SettingsSpeedLimitMinUnit", Translate(Subsystem.I18n.SpeedUnit));
					ChangeText("Label_SettingsSpeedLimitOnFlapsUpUnit", Translate(Subsystem.I18n.SpeedUnit));
					ChangeText("Label_SettingsSpeedLimitOnFlapsFullUnit", Translate(Subsystem.I18n.SpeedUnit));

					// Distance
					ChangeValue("Combobox_SettingsDistanceUnit", Subsystem.I18n.DistanceUnit);
					switch(Subsystem.I18n.DistanceUnit) {
						case "Kilometer":
							ChangeNumberTextbox("Textbox_AirportLibraryOuterMarkerDistance", "0", "20", "0.1", "0~20");
							ChangeNumberTextbox("Textbox_AirportLibraryMiddleMarkerDistance", "0", "20", "0.1", "0~20");
							ChangeNumberTextbox("Textbox_AirportLibraryInnerMarkerDistance", "0", "20", "0.1", "0~20");
							break;
						case "Mile":
							ChangeNumberTextbox("Textbox_AirportLibraryOuterMarkerDistance", "0", "12.43", "0.1", "0~12.43");
							ChangeNumberTextbox("Textbox_AirportLibraryMiddleMarkerDistance", "0", "12.43", "0.1", "0~12.43");
							ChangeNumberTextbox("Textbox_AirportLibraryInnerMarkerDistance", "0", "12.43", "0.1", "0~12.43");
							break;
						case "NauticalMile":
							ChangeNumberTextbox("Textbox_AirportLibraryOuterMarkerDistance", "0", "10.8", "0.1", "0~10.8");
							ChangeNumberTextbox("Textbox_AirportLibraryMiddleMarkerDistance", "0", "10.8", "0.1", "0~10.8");
							ChangeNumberTextbox("Textbox_AirportLibraryInnerMarkerDistance", "0", "10.8", "0.1", "0~10.8");
							break;
						default:
							AlertSystemError("The value of Subsystem.I18n.DistanceUnit \"" + Subsystem.I18n.DistanceUnit + "\" in function RefreshSubsystem is invalid.");
							break;
					}
					ChangeText("Label_AirportLibraryOuterMarkerDistanceUnit", Translate(Subsystem.I18n.DistanceUnit));
					ChangeText("Label_AirportLibraryMiddleMarkerDistanceUnit", Translate(Subsystem.I18n.DistanceUnit));
					ChangeText("Label_AirportLibraryInnerMarkerDistanceUnit", Translate(Subsystem.I18n.DistanceUnit));

					// Altitude
					ChangeValue("Combobox_SettingsAltitudeUnit", Subsystem.I18n.AltitudeUnit);
					switch(Subsystem.I18n.AltitudeUnit) {
						case "Meter":
							ChangeNumberTextbox("Textbox_PFDMCPAltitude", "-700", "15240", "50", "-609~15240");
							ChangeNumberTextbox("Textbox_AirportLibraryElevation", "-500", "5000", "5", "-500~5000");
							ChangeNumberTextbox("Textbox_AirportLibraryDecisionHeight", "15", "750", "5", "15~750");
							ChangeNumberTextbox("Textbox_SettingsSeatHeight", "0", "20", "1", "0~20");
							break;
						case "Feet":
						case "FeetButShowMeterBeside":
							ChangeNumberTextbox("Textbox_PFDMCPAltitude", "-2000", "50000", "100", "-2000~50000");
							ChangeNumberTextbox("Textbox_AirportLibraryElevation", "-1640", "16404", "10", "-1640~16404");
							ChangeNumberTextbox("Textbox_AirportLibraryDecisionHeight", "40", "2461", "10", "49~2461");
							ChangeNumberTextbox("Textbox_SettingsSeatHeight", "0", "66", "1", "0~66");
							break;
						default:
							AlertSystemError("The value of Subsystem.I18n.AltitudeUnit \"" + Subsystem.I18n.AltitudeUnit + "\" in function RefreshSubsystem is invalid.");
							break;
					}
					ChangeText("Label_PFDMCPAltitudeUnit", Translate(Subsystem.I18n.AltitudeUnit));
					ChangeText("Label_AirportLibraryElevationUnit", Translate(Subsystem.I18n.AltitudeUnit));
					ChangeText("Label_AirportLibraryDecisionHeightUnit", Translate(Subsystem.I18n.AltitudeUnit));
					ChangeText("Label_SettingsSeatHeightUnit", Translate(Subsystem.I18n.AltitudeUnit));

					// Vertical speed
					ChangeValue("Combobox_SettingsVerticalSpeedUnit", Subsystem.I18n.VerticalSpeedUnit);
					switch(Subsystem.I18n.VerticalSpeedUnit) {
						case "MeterPerSec":
							ChangeNumberTextbox("Textbox_PFDMCPVerticalSpeed", "-30", "30", "1", "-30~30");
							break;
						case "FeetPerMin":
							ChangeNumberTextbox("Textbox_PFDMCPVerticalSpeed", "-6000", "6000", "100", "-6000~6000");
							break;
						default:
							AlertSystemError("The value of Subsystem.I18n.VerticalSpeedUnit \"" + Subsystem.I18n.VerticalSpeedUnit + "\" in function RefreshSubsystem is invalid.");
							break;
					}
					ChangeText("Label_PFDMCPVerticalSpeedUnit", Translate(Subsystem.I18n.VerticalSpeedUnit));

					// Temperature
					ChangeValue("Combobox_SettingsTemperatureUnit", Subsystem.I18n.TemperatureUnit);
					switch(Subsystem.I18n.TemperatureUnit) {
						case "Celsius":
							ChangeNumberTextbox("Textbox_AirportLibraryTemperature", "-50", "50", "1", "-50~50");
							break;
						case "Fahrenheit":
							ChangeNumberTextbox("Textbox_AirportLibraryTemperature", "-58", "122", "1", "-58~122");
							break;
						default:
							AlertSystemError("The value of Subsystem.I18n.TemperatureUnit \"" + Subsystem.I18n.TemperatureUnit + "\" in function RefreshSubsystem is invalid.");
							break;
					}
					ChangeText("Label_AirportLibraryTemperatureUnit", Translate(Subsystem.I18n.TemperatureUnit));

					// Pressure
					ChangeValue("Combobox_SettingsPressureUnit", Subsystem.I18n.PressureUnit);
					switch(Subsystem.I18n.PressureUnit) {
						case "Hectopascal":
							ChangeNumberTextbox("Textbox_AirportLibraryQNH", "900", "1100", "1", "900~1100");
							break;
						case "InchOfMercury":
							ChangeNumberTextbox("Textbox_AirportLibraryQNH", "26.58", "32.48", "0.01", "26.58~32.48");
							break;
						default:
							AlertSystemError("The value of Subsystem.I18n.PressureUnit \"" + Subsystem.I18n.PressureUnit + "\" in function RefreshSubsystem is invalid.");
							break;
					}
					ChangeText("Label_AirportLibraryQNHUnit", Translate(Subsystem.I18n.PressureUnit));

			// Dev
			ChangeChecked("Checkbox_SettingsVideoFootageMode", Subsystem.Dev.VideoFootageMode);
			if(Subsystem.Dev.VideoFootageMode == true) {
				AddClass("Html", "VideoFootageMode");
			} else {
				RemoveClass("Html", "VideoFootageMode");
			}

		// Save user data
		localStorage.setItem("GPSPFD_Subsystem", JSON.stringify(Subsystem));
	}

	// PFD
	function ClockPFD() {
		// Automation
		clearTimeout(Automation.ClockPFD);
		Automation.ClockPFD = setTimeout(ClockPFD, Automation.ClockRate);

		// Update essentials
		PFD0.Stats.ClockTime = Date.now();

		// Call
		RefreshGPSStatus();
		RefreshAccelStatus();
		RefreshManualData();
		RefreshPFDData();
		RefreshScale();
		RefreshPanel();
		RefreshPFDAudio();
		RefreshTechInfo();

		// Update previous variables
		PFD0.Stats.PreviousClockTime = PFD0.Stats.ClockTime;
		PFD0.Stats.Speed.PreviousTapeDisplay = PFD0.Stats.Speed.TapeDisplay;
		PFD0.Stats.Altitude.PreviousTapeDisplay = PFD0.Stats.Altitude.TapeDisplay;
	}
		// Sub-functions
		function RefreshGPSStatus() {
			PFD0.Status.GPS = {
				IsPositionAvailable: false, IsPositionAccurate: false,
				IsSpeedAvailable: false, IsAltitudeAvailable: false, IsAltitudeAccurate: false, IsHeadingAvailable: false
			};
			if(PFD0.Stats.ClockTime - PFD0.RawData.GPS.Timestamp < 3000) {
				if(PFD0.RawData.GPS.Position.Lat != null && PFD0.RawData.GPS.Position.Lon != null) {
					PFD0.Status.GPS.IsPositionAvailable = true;
					if(PFD0.RawData.GPS.Position.Accuracy <= 10) {
						PFD0.Status.GPS.IsPositionAccurate = true;
					}
				}
				if(PFD0.RawData.GPS.Speed != null) {
					PFD0.Status.GPS.IsSpeedAvailable = true;
				}
				if(PFD0.RawData.GPS.Altitude.Altitude != null) {
					PFD0.Status.GPS.IsAltitudeAvailable = true;
					if(PFD0.RawData.GPS.Altitude.Accuracy <= 20) {
						PFD0.Status.GPS.IsAltitudeAccurate = true;
					}
				}
				if(PFD0.RawData.GPS.Heading != null) {
					PFD0.Status.GPS.IsHeadingAvailable = true;
				}
			}
		}
		function RefreshAccelStatus() {
			if(PFD0.Stats.ClockTime - PFD0.RawData.Accel.Timestamp < 1000 &&
			PFD0.RawData.Accel.Accel.Absolute.X != null && PFD0.RawData.Accel.Accel.AbsoluteWithGravity.X != null) {
				PFD0.Status.IsAccelAvailable = true;
			} else {
				PFD0.Status.IsAccelAvailable = false;
			}
		}
		function RefreshManualData() {
			// Attitude
			if(PFD.Attitude.IsEnabled == true && PFD.Attitude.Mode == "Manual") {
				PFD0.RawData.Manual.Attitude.Pitch = CheckRangeAndCorrect(PFD0.RawData.Manual.Attitude.Pitch + PFD0.RawData.Manual.Attitude.PitchTrend * ((PFD0.Stats.ClockTime - PFD0.Stats.PreviousClockTime) / 1000), -90, 90);
				PFD0.RawData.Manual.Attitude.Roll += PFD0.RawData.Manual.Attitude.RollTrend * ((PFD0.Stats.ClockTime - PFD0.Stats.PreviousClockTime) / 1000);
				if(PFD0.RawData.Manual.Attitude.Roll < -180) {
					PFD0.RawData.Manual.Attitude.Roll += 360;
				}
				if(PFD0.RawData.Manual.Attitude.Roll > 180) {
					PFD0.RawData.Manual.Attitude.Roll -= 360;
				}
			}

			// Speed
			if(PFD.Speed.Mode == "Manual") {
				PFD0.RawData.Manual.Speed = CheckRangeAndCorrect(PFD0.RawData.Manual.Speed + PFD0.RawData.Manual.SpeedTrend * ((PFD0.Stats.ClockTime - PFD0.Stats.PreviousClockTime) / 1000), 0, 555.55556);
			}

			// Altitude
			if(PFD.Altitude.Mode == "Manual") {
				PFD0.RawData.Manual.Altitude = CheckRangeAndCorrect(PFD0.RawData.Manual.Altitude + PFD0.RawData.Manual.AltitudeTrend * ((PFD0.Stats.ClockTime - PFD0.Stats.PreviousClockTime) / 1000), -609.6, 15240);
			}

			// Heading
			if(PFD.Heading.Mode == "Manual") {
				PFD0.RawData.Manual.Heading += PFD0.RawData.Manual.HeadingTrend * ((PFD0.Stats.ClockTime - PFD0.Stats.PreviousClockTime) / 1000);
				if(PFD0.RawData.Manual.Heading < 0) {
					PFD0.RawData.Manual.Heading += 360;
				}
				if(PFD0.RawData.Manual.Heading >= 360) {
					PFD0.RawData.Manual.Heading -= 360;
				}
			}
		}
		function RefreshPFDData() {
			// Initialization
			let ActiveAirport = 0, GroundAltitude = 0;
			switch(PFD.FlightMode.FlightMode) {
				case "DepartureGround":
				case "TakeOff":
				case "EmergencyReturn":
					ActiveAirport = structuredClone(AirportLibrary.Airport[AirportLibrary.Selection.Departure]);
					break;
				case "Cruise":
				case "Land":
				case "ArrivalGround":
					ActiveAirport = structuredClone(AirportLibrary.Airport[AirportLibrary.Selection.Arrival]);
					break;
				default:
					AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshPFDData is invalid.");
					break;
			}
			GroundAltitude = ActiveAirport.Elevation + PFD.Altitude.SeatHeight;

			// Attitude
			if(PFD.Attitude.IsEnabled == true) {
				switch(true) {
					case PFD.Attitude.Mode == "Accel" && PFD0.Status.IsAccelAvailable == true:
						PFD0.Stats.Attitude.Pitch = CheckRangeAndCorrect(PFD0.RawData.Accel.Attitude.Aligned.Pitch, -90, 90);
						PFD0.Stats.Attitude.Roll = PFD0.RawData.Accel.Attitude.Aligned.Roll;
						if(PFD0.Stats.Attitude.Roll < -180) {
							PFD0.Stats.Attitude.Roll += 360;
						}
						if(PFD0.Stats.Attitude.Roll > 180) {
							PFD0.Stats.Attitude.Roll -= 360;
						}
						break;
					case PFD.Attitude.Mode == "Manual":
						PFD0.Stats.Attitude.Pitch = PFD0.RawData.Manual.Attitude.Pitch;
						PFD0.Stats.Attitude.Roll = PFD0.RawData.Manual.Attitude.Roll;
						break;
					default:
						break;
				}
				PFD0.Stats.Attitude.Pitch2 = CheckRangeAndCorrect(PFD0.Stats.Attitude.Pitch, -20, 20);
			}

			// Altitude (Updated before speed because speed data relies on altitude variation)
			switch(true) {
				case PFD.Altitude.Mode == "GPS" && PFD0.Status.GPS.IsAltitudeAvailable == true:
					PFD0.Stats.Altitude.Altitude = PFD0.RawData.GPS.Altitude.Altitude;
					break;
				case PFD.Altitude.Mode == "Accel" && PFD0.Status.IsAccelAvailable == true:
				case PFD.Altitude.Mode == "DualChannel" && (PFD0.Status.GPS.IsAltitudeAvailable == true || PFD0.Status.IsAccelAvailable == true):
					PFD0.Stats.Altitude.Altitude = PFD0.RawData.Accel.Altitude;
					break;
				case PFD.Altitude.Mode == "Manual":
					PFD0.Stats.Altitude.Altitude = PFD0.RawData.Manual.Altitude;
					break;
				default:
					break;
			}
				// Tape
				PFD0.Stats.Altitude.TapeDisplay += (PFD0.Stats.Altitude.Altitude - PFD0.Stats.Altitude.TapeDisplay) / 50 * ((PFD0.Stats.ClockTime - PFD0.Stats.PreviousClockTime) / 30); // Use "ClockTime" here for smooth trend displaying.
				PFD0.Stats.Altitude.TapeDisplay = CheckRangeAndCorrect(PFD0.Stats.Altitude.TapeDisplay, -609.5, 15239.9); // It should have been -609.6 and 15240 meters. But -609.59999 can be converted to -2000.00001 feet, resulting in a display error on the balloon.

				// Additional indicators
					// Altitude trend
					PFD0.Stats.Altitude.Trend = (PFD0.Stats.Altitude.TapeDisplay - PFD0.Stats.Altitude.PreviousTapeDisplay) * (6000 / Math.max(PFD0.Stats.ClockTime - PFD0.Stats.PreviousClockTime, 1)); // (1) Altitude trend shows target altitude in 6 sec. (2) If refreshed too frequently, the divisor may become zero. So "Math.max" is applied here.
					PFD0.Stats.Altitude.TrendDisplay += (PFD0.Stats.Altitude.Trend - PFD0.Stats.Altitude.TrendDisplay) / 50;
					PFD0.Stats.Speed.Vertical = PFD0.Stats.Altitude.TrendDisplay / 6;

				// Balloon
				PFD0.Stats.Altitude.BalloonDisplay[1] = Math.trunc(ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.AltitudeUnit) / 10000);
				PFD0.Stats.Altitude.BalloonDisplay[2] = Math.trunc(ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.AltitudeUnit) % 10000 / 1000);
				PFD0.Stats.Altitude.BalloonDisplay[3] = Math.trunc(ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.AltitudeUnit) % 1000 / 100);
				PFD0.Stats.Altitude.BalloonDisplay[4] = ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.AltitudeUnit) % 100;
				if(System.Display.Anim > 0) {
					if(PFD0.Stats.Altitude.BalloonDisplay[4] > 80) {PFD0.Stats.Altitude.BalloonDisplay[3] += ((PFD0.Stats.Altitude.BalloonDisplay[4] - 80) / 20);} // Imitating the cockpit PFD rolling digits.
					if(PFD0.Stats.Altitude.BalloonDisplay[4] < -80) {PFD0.Stats.Altitude.BalloonDisplay[3] += ((PFD0.Stats.Altitude.BalloonDisplay[4] + 80) / 20);}
					if(PFD0.Stats.Altitude.BalloonDisplay[3] > 9) {PFD0.Stats.Altitude.BalloonDisplay[2] += (PFD0.Stats.Altitude.BalloonDisplay[3] - 9);}
					if(PFD0.Stats.Altitude.BalloonDisplay[3] < -9) {PFD0.Stats.Altitude.BalloonDisplay[2] += (PFD0.Stats.Altitude.BalloonDisplay[3] + 9);}
					if(PFD0.Stats.Altitude.BalloonDisplay[2] > 9) {PFD0.Stats.Altitude.BalloonDisplay[1] += (PFD0.Stats.Altitude.BalloonDisplay[2] - 9);}
					if(PFD0.Stats.Altitude.BalloonDisplay[2] < -9) {PFD0.Stats.Altitude.BalloonDisplay[1] += (PFD0.Stats.Altitude.BalloonDisplay[2] + 9);}
				} else {
					PFD0.Stats.Altitude.BalloonDisplay[4] = Math.trunc(PFD0.Stats.Altitude.BalloonDisplay[4] / 20) * 20;
				}

				// Altitude beep
				if(IsMCPAltitudeReached() == true) {
					PFD0.Stats.Altitude.BeepTimestamp = PFD0.Stats.ClockTime;
				}

			// Heading (Updated before speed because speed data relies on heading)
			switch(true) {
				case PFD.Heading.Mode == "GPS" && PFD0.Status.GPS.IsHeadingAvailable == true:
					PFD0.Stats.Heading.Heading = PFD0.RawData.GPS.Heading;
					break;
				case PFD.Heading.Mode == "Manual":
					PFD0.Stats.Heading.Heading = PFD0.RawData.Manual.Heading;
					break;
				default:
					break;
			}
			PFD0.Stats.Heading.Display += (PFD0.Stats.Heading.Heading - PFD0.Stats.Heading.Display) / 50;

			// Speed
			switch(true) {
				case PFD.Speed.Mode == "GPS" && PFD0.Status.GPS.IsSpeedAvailable == true:
					PFD0.Stats.Speed.Speed = PFD0.RawData.GPS.Speed;
					break;
				case PFD.Speed.Mode == "Accel" && PFD0.Status.IsAccelAvailable == true:
				case PFD.Speed.Mode == "DualChannel" && (PFD0.Status.GPS.IsSpeedAvailable == true || PFD0.Status.IsAccelAvailable == true):
					PFD0.Stats.Speed.Speed = PFD0.RawData.Accel.Speed.Speed;
					break;
				case PFD.Speed.Mode == "Manual":
					PFD0.Stats.Speed.Speed = PFD0.RawData.Manual.Speed;
					break;
				default:
					break;
			}
				// Pitch
				if(PFD0.Stats.Speed.Speed > 0) {
					PFD0.Stats.Speed.Pitch = RadToDeg(Math.asin(CheckRangeAndCorrect(PFD0.Stats.Speed.Vertical / PFD0.Stats.Speed.Speed, -1, 1)));
				} else {
					PFD0.Stats.Speed.Pitch = 0;
				}

				// GS
				PFD0.Stats.Speed.GS = Math.sqrt(Math.max(Math.pow(PFD0.Stats.Speed.Speed, 2) - Math.pow(PFD0.Stats.Speed.Vertical, 2), 0));
				PFD0.Stats.Speed.GSDisplay += (PFD0.Stats.Speed.GS - PFD0.Stats.Speed.GSDisplay) / 50 * ((PFD0.Stats.ClockTime - PFD0.Stats.PreviousClockTime) / 30);

				// Avg GS
				PFD0.Stats.Speed.AvgGSDisplay += (PFD0.Stats.Speed.AvgGS - PFD0.Stats.Speed.AvgGSDisplay) / 50 * ((PFD0.Stats.ClockTime - PFD0.Stats.PreviousClockTime) / 30);

				// TAS
				if((PFD.Heading.Mode == "GPS" && PFD0.Status.GPS.IsHeadingAvailable == true) ||
				PFD.Heading.Mode == "Manual") {
					PFD0.Stats.Speed.Wind.Heading = PFD.Speed.Wind.Direction + 180;
					if(PFD0.Stats.Speed.Wind.Heading >= 360) {
						PFD0.Stats.Speed.Wind.Heading -= 360;
					}
					PFD0.Stats.Speed.Wind.RelativeHeading = PFD0.Stats.Speed.Wind.Heading - PFD0.Stats.Heading.Display;
					PFD0.Stats.Speed.TAS = CalcTAS(PFD0.Stats.Speed.GS, PFD0.Stats.Speed.Wind.RelativeHeading, PFD.Speed.Wind.Speed, PFD0.Stats.Speed.Vertical);
				} else {
					PFD0.Stats.Speed.TAS = CalcTAS(PFD0.Stats.Speed.GS, null, null, PFD0.Stats.Speed.Vertical);
				}
				PFD0.Stats.Speed.TASDisplay += (PFD0.Stats.Speed.TAS - PFD0.Stats.Speed.TASDisplay) / 50 * ((PFD0.Stats.ClockTime - PFD0.Stats.PreviousClockTime) / 30);

				// IAS
				PFD0.Stats.Speed.IAS = CalcIAS(PFD.Speed.IASAlgorithm, PFD0.Stats.Speed.TAS, PFD0.Stats.Altitude.TapeDisplay,
					GroundAltitude, ActiveAirport.Temperature, ActiveAirport.RelativeHumidity, ActiveAirport.QNH,
					PFD.Attitude.IsEnabled, Math.abs(PFD0.Stats.Attitude.Pitch - PFD0.Stats.Speed.Pitch));
					// Tape
					PFD0.Stats.Speed.TapeDisplay += (PFD0.Stats.Speed.IAS - PFD0.Stats.Speed.TapeDisplay) / 50 * ((PFD0.Stats.ClockTime - PFD0.Stats.PreviousClockTime) / 30);
					PFD0.Stats.Speed.TapeDisplay = CheckRangeAndCorrect(PFD0.Stats.Speed.TapeDisplay, 0, 277.5);

					// Additional indicators
						// Speed trend
						PFD0.Stats.Speed.Trend = (PFD0.Stats.Speed.TapeDisplay - PFD0.Stats.Speed.PreviousTapeDisplay) * (10000 / Math.max(PFD0.Stats.ClockTime - PFD0.Stats.PreviousClockTime, 1)); // Speed trend shows target speed in 10 sec.
						PFD0.Stats.Speed.TrendDisplay += (PFD0.Stats.Speed.Trend - PFD0.Stats.Speed.TrendDisplay) / 50;

						// Avg IAS
						PFD0.Stats.Speed.AvgIASDisplay += (PFD0.Stats.Speed.AvgIAS - PFD0.Stats.Speed.AvgIASDisplay) / 50 * ((PFD0.Stats.ClockTime - PFD0.Stats.PreviousClockTime) / 30);
						PFD0.Stats.Speed.AvgIASDisplay = CheckRangeAndCorrect(PFD0.Stats.Speed.AvgIASDisplay, 0, 277.5);

					// Balloon
					PFD0.Stats.Speed.BalloonDisplay[1] = Math.trunc(ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.SpeedUnit) / 100);
					PFD0.Stats.Speed.BalloonDisplay[2] = Math.trunc(ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.SpeedUnit) % 100 / 10);
					PFD0.Stats.Speed.BalloonDisplay[3] = ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.SpeedUnit) % 10;
					if(System.Display.Anim > 0) {
						if(PFD0.Stats.Speed.BalloonDisplay[3] > 9) {PFD0.Stats.Speed.BalloonDisplay[2] += (PFD0.Stats.Speed.BalloonDisplay[3] - 9);}
						if(PFD0.Stats.Speed.BalloonDisplay[2] > 9) {PFD0.Stats.Speed.BalloonDisplay[1] += (PFD0.Stats.Speed.BalloonDisplay[2] - 9);}
					} else {
						PFD0.Stats.Speed.BalloonDisplay[3] = Math.trunc(PFD0.Stats.Speed.BalloonDisplay[3]);
					}

				// Mach number
				PFD0.Stats.Speed.MachNumber = CalcMachNumber(PFD0.Stats.Speed.TASDisplay, PFD0.Stats.Altitude.TapeDisplay, GroundAltitude, ActiveAirport.Temperature);

			// MCP
				// Speed
				switch(PFD.MCP.Speed.Mode) {
					case "IAS":
						PFD.MCP.Speed.MachNumber = CheckRangeAndCorrect(
							CalcMCPMachNumberFromIAS(PFD.Speed.IASAlgorithm, PFD.MCP.Speed.IAS, PFD0.Stats.Altitude.TapeDisplay,
							GroundAltitude, ActiveAirport.Temperature, ActiveAirport.RelativeHumidity, ActiveAirport.QNH),
							0, 0.999);
						break;
					case "MachNumber":
						PFD.MCP.Speed.IAS = CheckRangeAndCorrect(
							CalcMCPIASFromMachNumber(PFD.Speed.IASAlgorithm, PFD.MCP.Speed.MachNumber, PFD0.Stats.Altitude.TapeDisplay,
							GroundAltitude, ActiveAirport.Temperature, ActiveAirport.RelativeHumidity, ActiveAirport.QNH),
							0, 277.5);
						break;
					default:
						AlertSystemError("The value of PFD.MCP.Speed.Mode \"" + PFD.MCP.Speed.Mode + "\" in function RefreshPFDData is invalid.");
						break;
				}

			// Nav
			if(PFD.Nav.IsEnabled == true && PFD0.Status.GPS.IsPositionAvailable == true) {
				// Position
				PFD0.Stats.Nav.Lat = PFD0.RawData.GPS.Position.Lat;
				PFD0.Stats.Nav.Lon = PFD0.RawData.GPS.Position.Lon;

				// Distance and bearing
				PFD0.Stats.Nav.Distance = CalcDistance(PFD0.Stats.Nav.Lat, PFD0.Stats.Nav.Lon, ActiveAirport.Coordinates.Lat, ActiveAirport.Coordinates.Lon);
				PFD0.Stats.Nav.Bearing = CalcBearing(PFD0.Stats.Nav.Lat, PFD0.Stats.Nav.Lon, ActiveAirport.Coordinates.Lat, ActiveAirport.Coordinates.Lon);

				// DME
				switch(PFD.Nav.ETACalcMethod) {
					case "UseRealTimeGS":
						if(PFD0.Stats.Speed.GSDisplay > 0) {
							PFD0.Stats.Nav.ETA = PFD0.Stats.Nav.Distance / PFD0.Stats.Speed.GSDisplay * 1000; // (Meter / meter per sec) = sec, sec * 1000 = millisec.
						}
						break;
					case "UseAvgGS":
						if(PFD0.Stats.Speed.AvgGSDisplay > 0) {
							PFD0.Stats.Nav.ETA = PFD0.Stats.Nav.Distance / PFD0.Stats.Speed.AvgGSDisplay * 1000;
						}
						break;
					default:
						AlertSystemError("The value of PFD.Nav.ETACalcMethod \"" + PFD.Nav.ETACalcMethod + "\" in function RefreshPFDData is invalid.");
						break;
				}

				// Localizer
				PFD0.Stats.Nav.LocalizerDeviation = PFD0.Stats.Heading.Display - PFD0.Stats.Nav.Bearing;

				// Glide slope
				if(PFD0.Stats.Nav.Distance > 0) {
					PFD0.Stats.Nav.GlideSlopeDeviation = RadToDeg(Math.atan(PFD0.Stats.Altitude.RadioDisplay / PFD0.Stats.Nav.Distance)) - ActiveAirport.GlideSlopeAngle;
				} else {
					PFD0.Stats.Nav.GlideSlopeDeviation = -ActiveAirport.GlideSlopeAngle;
				}

				// Marker beacon
				PFD0.Stats.Nav.MarkerBeacon = "";
				if(Math.abs(PFD0.Stats.Nav.LocalizerDeviation) <= 2) {
					switch(true) {
						case Math.abs(PFD0.Stats.Nav.Distance - ActiveAirport.MarkerBeaconDistance.Outer) < PFD0.Stats.Altitude.RadioDisplay / 3:
							PFD0.Stats.Nav.MarkerBeacon = "OuterMarker";
							break;
						case Math.abs(PFD0.Stats.Nav.Distance - ActiveAirport.MarkerBeaconDistance.Middle) < PFD0.Stats.Altitude.RadioDisplay / 3:
							PFD0.Stats.Nav.MarkerBeacon = "MiddleMarker";
							break;
						case Math.abs(PFD0.Stats.Nav.Distance - ActiveAirport.MarkerBeaconDistance.Inner) < PFD0.Stats.Altitude.RadioDisplay / 3:
							PFD0.Stats.Nav.MarkerBeacon = "InnerMarker";
							break;
						default:
							break;
					}
				}
			}

			// Radio altitude
			PFD0.Stats.Altitude.RadioDisplay = PFD0.Stats.Altitude.TapeDisplay - GroundAltitude;

			// Decision altitude
			switch(PFD.FlightMode.FlightMode) {
				case "DepartureGround":
				case "TakeOff":
				case "Cruise":
				case "ArrivalGround":
					PFD0.Status.IsDecisionAltitudeActive = false;
					break;
				case "Land":
				case "EmergencyReturn":
					if(PFD0.Stats.Altitude.TapeDisplay <= GroundAltitude + ActiveAirport.DecisionHeight) {
						PFD0.Status.IsDecisionAltitudeActive = true;
						if(PFD0.Stats.Altitude.PreviousTapeDisplay > GroundAltitude + ActiveAirport.DecisionHeight) {
							PFD0.Stats.Altitude.DecisionTimestamp = PFD0.Stats.ClockTime;
						}
					}
					break;
				default:
					AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshPFDData is invalid.");
					break;
			}

			// Flight mode auto switch & airport data auto swap
			if(PFD.FlightMode.AutoSwitchFlightModeAndSwapAirports == true) {
				switch(PFD.FlightMode.FlightMode) {
					case "DepartureGround":
						if(PFD0.Stats.Speed.TapeDisplay >= PFD.Speed.TakeOff.VR &&
						PFD0.Stats.Altitude.TapeDisplay - GroundAltitude >= 9.144 &&
						PFD0.Stats.Altitude.PreviousTapeDisplay - GroundAltitude < 9.144) {
							PFD.FlightMode.FlightMode = "TakeOff";
							PFD0.Stats.FlightModeTimestamp = PFD0.Stats.ClockTime;
							setTimeout(RefreshPFD, 0);
						}
						break;
					case "TakeOff":
						if(PFD0.Stats.Altitude.TapeDisplay - GroundAltitude >= 914.4 &&
						PFD0.Stats.Altitude.PreviousTapeDisplay - GroundAltitude < 914.4) {
							PFD.FlightMode.FlightMode = "Cruise";
							PFD0.Stats.FlightModeTimestamp = PFD0.Stats.ClockTime;
							setTimeout(RefreshPFD, 0);
						}
						break;
					case "Cruise":
						if(PFD0.Stats.Altitude.TapeDisplay - GroundAltitude <= 914.4 &&
						PFD0.Stats.Altitude.PreviousTapeDisplay - GroundAltitude > 914.4) {
							PFD.FlightMode.FlightMode = "Land";
							PFD0.Stats.FlightModeTimestamp = PFD0.Stats.ClockTime;
							setTimeout(RefreshPFD, 0);
						}
						break;
					case "Land":
						if(PFD0.Stats.Altitude.TapeDisplay - GroundAltitude <= 9.144 &&
						PFD0.Stats.Altitude.PreviousTapeDisplay - GroundAltitude > 9.144) {
							PFD.FlightMode.FlightMode = "ArrivalGround";
							PFD0.Stats.FlightModeTimestamp = PFD0.Stats.ClockTime;
							setTimeout(RefreshPFD, 0);
						}
						break;
					case "ArrivalGround":
						if(PFD0.Stats.Speed.TapeDisplay <= 2.572 && PFD0.Stats.Speed.PreviousTapeDisplay > 2.572) {
							PFD.FlightMode.FlightMode = "DepartureGround";
							SwapAirports();
							PFD0.Stats.FlightModeTimestamp = PFD0.Stats.ClockTime;
							setTimeout(RefreshPFD, 0);
						}
						break;
					case "EmergencyReturn":
						if(PFD0.Stats.Altitude.TapeDisplay - GroundAltitude <= 9.144 &&
						PFD0.Stats.Altitude.PreviousTapeDisplay - GroundAltitude > 9.144) {
							PFD.FlightMode.FlightMode = "DepartureGround";
							PFD0.Stats.FlightModeTimestamp = PFD0.Stats.ClockTime;
							setTimeout(RefreshPFD, 0);
						}
						break;
					default:
						AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshPFDData is invalid.");
						break;
				}
			}

			// Alerts
				// Initialize
				PFD0.Alert.Active = {
					SpeedCallout: "", AltitudeCallout: "", AttitudeWarning: "", SpeedWarning: "", AltitudeWarning: ""
				};

				// Callouts
					// Speed callout
					if((PFD.Speed.Mode == "GPS" && PFD0.Status.GPS.IsSpeedAvailable == true) ||
					(PFD.Speed.Mode == "Accel" && PFD0.Status.IsAccelAvailable == true) ||
					(PFD.Speed.Mode == "DualChannel" && (PFD0.Status.GPS.IsSpeedAvailable == true || PFD0.Status.IsAccelAvailable == true)) ||
					PFD.Speed.Mode == "Manual") {
						if(IsV1() == true) {
							PFD0.Alert.Active.SpeedCallout = "V1";
						}
					}

					// Altitude callout
					if((PFD.Altitude.Mode == "GPS" && PFD0.Status.GPS.IsAltitudeAvailable == true) ||
					(PFD.Altitude.Mode == "Accel" && PFD0.Status.IsAccelAvailable == true) ||
					(PFD.Altitude.Mode == "DualChannel" && (PFD0.Status.GPS.IsAltitudeAvailable == true || PFD0.Status.IsAccelAvailable == true)) ||
					PFD.Altitude.Mode == "Manual") {
						if(IsMCPAltitudeReached() == true) {
							PFD0.Alert.Active.AltitudeCallout = "AltitudeBeep";
						}
						switch(PFD.FlightMode.FlightMode) {
							case "Land":
							case "ArrivalGround":
							case "EmergencyReturn":
								let ConvertedRadioAltitude = ConvertUnit(PFD0.Stats.Altitude.RadioDisplay, "Meter", Subsystem.I18n.AltitudeUnit),
								ConvertedPreviousRadioAltitude = ConvertUnit(PFD0.Stats.Altitude.PreviousTapeDisplay - GroundAltitude, "Meter", Subsystem.I18n.AltitudeUnit),
								ConvertedDecisionHeight = ConvertUnit(ActiveAirport.DecisionHeight, "Meter", Subsystem.I18n.AltitudeUnit);
								if(ConvertedRadioAltitude <= 2500 && ConvertedPreviousRadioAltitude > 2500) {
									PFD0.Alert.Active.AltitudeCallout = "2500";
								}
								if(ConvertedRadioAltitude <= 1000 && ConvertedPreviousRadioAltitude > 1000) {
									PFD0.Alert.Active.AltitudeCallout = "1000";
								}
								if(ConvertedRadioAltitude <= 500 && ConvertedPreviousRadioAltitude > 500) {
									PFD0.Alert.Active.AltitudeCallout = "500";
								}
								if(ConvertedRadioAltitude <= 400 && ConvertedPreviousRadioAltitude > 400) {
									PFD0.Alert.Active.AltitudeCallout = "400";
								}
								if(ConvertedRadioAltitude <= 300 && ConvertedPreviousRadioAltitude > 300) {
									PFD0.Alert.Active.AltitudeCallout = "300";
								}
								if(ConvertedRadioAltitude <= 200 && ConvertedPreviousRadioAltitude > 200) {
									PFD0.Alert.Active.AltitudeCallout = "200";
								}
								if(ConvertedRadioAltitude <= 100 && ConvertedPreviousRadioAltitude > 100) {
									PFD0.Alert.Active.AltitudeCallout = "100";
								}
								if(ConvertedRadioAltitude <= 50 && ConvertedPreviousRadioAltitude > 50) {
									PFD0.Alert.Active.AltitudeCallout = "50";
								}
								if(ConvertedRadioAltitude <= 40 && ConvertedPreviousRadioAltitude > 40) {
									PFD0.Alert.Active.AltitudeCallout = "40";
								}
								if(ConvertedRadioAltitude <= 30 && ConvertedPreviousRadioAltitude > 30) {
									PFD0.Alert.Active.AltitudeCallout = "30";
								}
								if(ConvertedRadioAltitude <= 20 && ConvertedPreviousRadioAltitude > 20) {
									PFD0.Alert.Active.AltitudeCallout = "20";
								}
								if(ConvertedRadioAltitude <= 10 && ConvertedPreviousRadioAltitude > 10) {
									PFD0.Alert.Active.AltitudeCallout = "10";
								}
								if(ConvertedRadioAltitude <= 5 && ConvertedPreviousRadioAltitude > 5) {
									PFD0.Alert.Active.AltitudeCallout = "5";
								}
								if(ConvertedRadioAltitude <= (ConvertedDecisionHeight + 100) && ConvertedPreviousRadioAltitude > (ConvertedDecisionHeight + 100)) {
									PFD0.Alert.Active.AltitudeCallout = "HundredAbove";
								}
								if(ConvertedRadioAltitude <= (ConvertedDecisionHeight + 80) && ConvertedPreviousRadioAltitude > (ConvertedDecisionHeight + 80)) {
									PFD0.Alert.Active.AltitudeCallout = "ApproachingMinimums";
								}
								if(ConvertedRadioAltitude <= ConvertedDecisionHeight && ConvertedPreviousRadioAltitude > ConvertedDecisionHeight) {
									PFD0.Alert.Active.AltitudeCallout = "Minimums";
								}
								break;
							case "DepartureGround":
							case "TakeOff":
							case "Cruise":
								break;
							default:
								AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshPFDData is invalid.");
								break;
						}
					}

				// Warnings
				if(PFD.WarningSystem.IsEnabled == true) {
					// Attitude warning
					if(PFD.Attitude.IsEnabled == true) {
						if((PFD.Attitude.Mode == "Accel" && PFD0.Status.IsAccelAvailable == true) ||
						PFD.Attitude.Mode == "Manual") {
							if(IsExcessiveBankAngle() == true) {
								PFD0.Alert.Active.AttitudeWarning = "BankAngle";
							}
						}
					}

					// Speed warning
					if((PFD.Speed.Mode == "GPS" && PFD0.Status.GPS.IsSpeedAvailable == true) ||
					(PFD.Speed.Mode == "Accel" && PFD0.Status.IsAccelAvailable == true) ||
					(PFD.Speed.Mode == "DualChannel" && (PFD0.Status.GPS.IsSpeedAvailable == true || PFD0.Status.IsAccelAvailable == true)) ||
					PFD.Speed.Mode == "Manual") {
						if(IsAirspeedLow() == true) {
							PFD0.Alert.Active.SpeedWarning = "AirspeedLow";
						}
						if(IsOverspeed() == true) {
							PFD0.Alert.Active.SpeedWarning = "Overspeed";
						}
					}

					// Altitude warning
					if((PFD.Altitude.Mode == "GPS" && PFD0.Status.GPS.IsAltitudeAvailable == true) ||
					(PFD.Altitude.Mode == "Accel" && PFD0.Status.IsAccelAvailable == true) ||
					(PFD.Altitude.Mode == "DualChannel" && (PFD0.Status.GPS.IsAltitudeAvailable == true || PFD0.Status.IsAccelAvailable == true)) ||
					PFD.Altitude.Mode == "Manual") {
						if(IsDontSink() == true) {
							PFD0.Alert.Active.AltitudeWarning = "DontSink";
						}
						if(PFD.Nav.IsEnabled == true && PFD0.Status.GPS.IsPositionAvailable == true) {
							if(IsExcessivelyBelowGlideSlope() == true) {
								PFD0.Alert.Active.AltitudeWarning = "GlideSlope";
							}
						}
						if(IsSinkRate() == true) {
							PFD0.Alert.Active.AltitudeWarning = "SinkRate";
						}
						if(IsSinkRatePullUp() == true) {
							PFD0.Alert.Active.AltitudeWarning = "PullUp";
						}
					}
				}
		}
		function RefreshScale() {
			let Elements = document.getElementsByClassName("PFDPanel"), ActivePFDPanelID = "Unknown";
			for(let Looper = 0; Looper < Elements.length; Looper++) {
				if(Elements[Looper].classList.contains("HiddenHorizontally") == false) {
					ActivePFDPanelID = Elements[Looper].id;
					break;
				}
			}
			if(ActivePFDPanelID == "Unknown") {
				AlertSystemError("There is not an active PFD panel.");
			}
			let PFDScale = Math.min((ReadWidth("PFDViewport") + 30) / ReadWidth(ActivePFDPanelID), (ReadHeight("PFDViewport") + 30) / ReadHeight(ActivePFDPanelID));
			if(Subsystem.Display.FlipPFDVertically == false) {
				ChangeScale(ActivePFDPanelID, PFDScale);
			} else {
				ChangeScale(ActivePFDPanelID, PFDScale + ", " + (-PFDScale));
			}
		}
		function RefreshPanel() {
			switch(Subsystem.Display.PFDStyle) {
				case "Default":
					RefreshDefaultPanel();
					break;
				case "HUD":
					RefreshHUDPanel();
					break;
				case "Bocchi737":
				case "AnalogGauges":
					AlertSystemError("A PFD style which is still under construction was selected.");
					break;
				case "AutomobileSpeedometer":
					RefreshAutomobileSpeedometerPanel();
					break;
				default:
					AlertSystemError("The value of Subsystem.Display.PFDStyle \"" + Subsystem.Display.PFDStyle + "\" in function RefreshPFDPanel is invalid.");
					break;
			}
		}
			// Sub-functions
			// These functions are in separate files.

		function RefreshPFDAudio() {
			switch(Subsystem.Audio.Scheme) {
				case "Boeing":
					RefreshBoeingAudio();
					break;
				case "Airbus":
					RefreshAirbusAudio();
					break;
				default:
					AlertSystemError("The value of Subsystem.Audio.Scheme \"" + Subsystem.Audio.Scheme + "\" in function RefreshPFDAudio is invalid.");
					break;
			}
		}
			// Sub-functions
			function RefreshBoeingAudio() {
				// Attitude
				if(PFD0.Alert.Active.AttitudeWarning != PFD0.Alert.NowPlaying.AttitudeWarning) {
					switch(PFD0.Alert.Active.AttitudeWarning) {
						case "":
							StopAudio("Audio_AttitudeAlert");
							break;
						case "BankAngle":
							ChangeAudioLoop("Audio_AttitudeAlert", true);
							PlayAudio("Audio_AttitudeAlert", "audio/Common_" + PFD0.Alert.Active.AttitudeWarning + ".mp3");
							break;
						default:
							AlertSystemError("The value of PFD0.Alert.Active.AttitudeWarning \"" + PFD0.Alert.Active.AttitudeWarning + "\" in function RefreshBoeingAudio is invalid.");
							break;
					}
					PFD0.Alert.NowPlaying.AttitudeWarning = PFD0.Alert.Active.AttitudeWarning;
				}

				// Speed
				if(PFD0.Alert.Active.SpeedWarning != PFD0.Alert.NowPlaying.SpeedWarning) {
					switch(PFD0.Alert.Active.SpeedWarning) {
						case "":
							StopAudio("Audio_SpeedAlert");
							break;
						case "AirspeedLow":
						case "Overspeed":
							ChangeAudioLoop("Audio_SpeedAlert", true);
							PlayAudio("Audio_SpeedAlert", "audio/Boeing_" + PFD0.Alert.Active.SpeedWarning + ".mp3");
							break;
						default:
							AlertSystemError("The value of PFD0.Alert.Active.SpeedWarning \"" + PFD0.Alert.Active.SpeedWarning + "\" in function RefreshBoeingAudio is invalid.");
							break;
					}
					PFD0.Alert.NowPlaying.SpeedWarning = PFD0.Alert.Active.SpeedWarning;
				}
				if(PFD0.Alert.Active.SpeedCallout != PFD0.Alert.NowPlaying.SpeedCallout && PFD0.Alert.Active.SpeedWarning == "") {
					switch(PFD0.Alert.Active.SpeedCallout) {
						case "":
							break;
						case "V1":
							ChangeAudioLoop("Audio_SpeedAlert", false);
							PlayAudio("Audio_SpeedAlert", "audio/Boeing_" + PFD0.Alert.Active.SpeedCallout + ".mp3");
							break;
						default:
							AlertSystemError("The value of PFD0.Alert.Active.SpeedCallout \"" + PFD0.Alert.Active.SpeedCallout + "\" in function RefreshBoeingAudio is invalid.");
							break;
					}
					PFD0.Alert.NowPlaying.SpeedCallout = PFD0.Alert.Active.SpeedCallout;
				}

				// Altitude
				if(PFD0.Alert.Active.AltitudeWarning != PFD0.Alert.NowPlaying.AltitudeWarning) {
					switch(PFD0.Alert.Active.AltitudeWarning) {
						case "":
							StopAudio("Audio_AltitudeAlert");
							break;
						case "DontSink":
						case "GlideSlope":
						case "SinkRate":
						case "PullUp":
							ChangeAudioLoop("Audio_AltitudeAlert", true);
							PlayAudio("Audio_AltitudeAlert", "audio/Common_" + PFD0.Alert.Active.AltitudeWarning + ".mp3");
							break;
						default:
							AlertSystemError("The value of PFD0.Alert.Active.AltitudeWarning \"" + PFD0.Alert.Active.AltitudeWarning + "\" in function RefreshBoeingAudio is invalid.");
							break;
					}
					PFD0.Alert.NowPlaying.AltitudeWarning = PFD0.Alert.Active.AltitudeWarning;
				}
				if(PFD0.Alert.Active.AltitudeCallout != PFD0.Alert.NowPlaying.AltitudeCallout && PFD0.Alert.Active.AltitudeWarning == "") {
					switch(PFD0.Alert.Active.AltitudeCallout) {
						case "":
						case "5":
						case "HundredAbove":
							break;
						case "AltitudeBeep":
							ChangeAudioLoop("Audio_AltitudeAlert", false);
							PlayAudio("Audio_AltitudeAlert", "audio/Common_" + PFD0.Alert.Active.AltitudeCallout + ".mp3");
							break;
						case "2500":
						case "1000":
						case "500":
						case "400":
						case "300":
						case "200":
						case "100":
						case "50":
						case "40":
						case "30":
						case "20":
						case "10":
						case "ApproachingMinimums":
						case "Minimums":
							ChangeAudioLoop("Audio_AltitudeAlert", false);
							PlayAudio("Audio_AltitudeAlert", "audio/Boeing_" + PFD0.Alert.Active.AltitudeCallout + ".mp3");
							break;
						default:
							AlertSystemError("The value of PFD0.Alert.Active.AltitudeCallout \"" + PFD0.Alert.Active.AltitudeCallout + "\" in function RefreshBoeingAudio is invalid.");
							break;
					}
					PFD0.Alert.NowPlaying.AltitudeCallout = PFD0.Alert.Active.AltitudeCallout;
				}
			}
			function RefreshAirbusAudio() {
				// Attitude
				if(PFD0.Alert.Active.AttitudeWarning != PFD0.Alert.NowPlaying.AttitudeWarning) {
					switch(PFD0.Alert.Active.AttitudeWarning) {
						case "":
							StopAudio("Audio_AttitudeAlert");
							break;
						case "BankAngle":
							ChangeAudioLoop("Audio_AttitudeAlert", true);
							PlayAudio("Audio_AttitudeAlert", "audio/Common_" + PFD0.Alert.Active.AttitudeWarning + ".mp3");
							break;
						default:
							AlertSystemError("The value of PFD0.Alert.Active.AttitudeWarning \"" + PFD0.Alert.Active.AttitudeWarning + "\" in function RefreshAirbusAudio is invalid.");
							break;
					}
					PFD0.Alert.NowPlaying.AttitudeWarning = PFD0.Alert.Active.AttitudeWarning;
				}

				// Speed
				if(PFD0.Alert.Active.SpeedWarning != PFD0.Alert.NowPlaying.SpeedWarning) {
					switch(PFD0.Alert.Active.SpeedWarning) {
						case "":
							StopAudio("Audio_SpeedAlert");
							break;
						case "AirspeedLow":
						case "Overspeed":
							ChangeAudioLoop("Audio_SpeedAlert", true);
							PlayAudio("Audio_SpeedAlert", "audio/Airbus_" + PFD0.Alert.Active.SpeedWarning + ".mp3");
							break;
						default:
							AlertSystemError("The value of PFD0.Alert.Active.SpeedWarning \"" + PFD0.Alert.Active.SpeedWarning + "\" in function RefreshAirbusAudio is invalid.");
							break;
					}
					PFD0.Alert.NowPlaying.SpeedWarning = PFD0.Alert.Active.SpeedWarning;
				}
				if(PFD0.Alert.Active.SpeedCallout != PFD0.Alert.NowPlaying.SpeedCallout && PFD0.Alert.Active.SpeedWarning == "") {
					switch(PFD0.Alert.Active.SpeedCallout) {
						case "":
							break;
						case "V1":
							ChangeAudioLoop("Audio_SpeedAlert", false);
							PlayAudio("Audio_SpeedAlert", "audio/Airbus_" + PFD0.Alert.Active.SpeedCallout + ".mp3");
							break;
						default:
							AlertSystemError("The value of PFD0.Alert.Active.SpeedCallout \"" + PFD0.Alert.Active.SpeedCallout + "\" in function RefreshAirbusAudio is invalid.");
							break;
					}
					PFD0.Alert.NowPlaying.SpeedCallout = PFD0.Alert.Active.SpeedCallout;
				}

				// Altitude
				if(PFD0.Alert.Active.AltitudeWarning != PFD0.Alert.NowPlaying.AltitudeWarning) {
					switch(PFD0.Alert.Active.AltitudeWarning) {
						case "":
							StopAudio("Audio_AltitudeAlert");
							break;
						case "DontSink":
						case "GlideSlope":
						case "SinkRate":
						case "PullUp":
							ChangeAudioLoop("Audio_AltitudeAlert", true);
							PlayAudio("Audio_AltitudeAlert", "audio/Common_" + PFD0.Alert.Active.AltitudeWarning + ".mp3");
							break;
						default:
							AlertSystemError("The value of PFD0.Alert.Active.AltitudeWarning \"" + PFD0.Alert.Active.AltitudeWarning + "\" in function RefreshAirbusAudio is invalid.");
							break;
					}
					PFD0.Alert.NowPlaying.AltitudeWarning = PFD0.Alert.Active.AltitudeWarning;
				}
				if(PFD0.Alert.Active.AltitudeCallout != PFD0.Alert.NowPlaying.AltitudeCallout && PFD0.Alert.Active.AltitudeWarning == "") {
					switch(PFD0.Alert.Active.AltitudeCallout) {
						case "":
						case "10":
						case "ApproachingMinimums":
							break;
						case "AltitudeBeep":
							ChangeAudioLoop("Audio_AltitudeAlert", false);
							PlayAudio("Audio_AltitudeAlert", "audio/Common_" + PFD0.Alert.Active.AltitudeCallout + ".mp3");
							break;
						case "2500":
						case "1000":
						case "500":
						case "400":
						case "300":
						case "200":
						case "100":
						case "50":
						case "40":
						case "30":
						case "20":
						case "5":
						case "HundredAbove":
						case "Minimums":
							ChangeAudioLoop("Audio_AltitudeAlert", false);
							PlayAudio("Audio_AltitudeAlert", "audio/Airbus_" + PFD0.Alert.Active.AltitudeCallout + ".mp3");
							break;
						default:
							AlertSystemError("The value of PFD0.Alert.Active.AltitudeCallout \"" + PFD0.Alert.Active.AltitudeCallout + "\" in function RefreshAirbusAudio is invalid.");
							break;
					}
					PFD0.Alert.NowPlaying.AltitudeCallout = PFD0.Alert.Active.AltitudeCallout;
				}
			}

		function RefreshTechInfo() {
			// GPS
			if(PFD0.RawData.GPS.Position.Lat != null) {
				ChangeText("Label_PFDTechInfoLat", PFD0.RawData.GPS.Position.Lat.toFixed(5));
			} else {
				ChangeText("Label_PFDTechInfoLat", "N/A");
			}
			if(PFD0.RawData.GPS.Position.Lon != null) {
				ChangeText("Label_PFDTechInfoLon", PFD0.RawData.GPS.Position.Lon.toFixed(5));
			} else {
				ChangeText("Label_PFDTechInfoLon", "N/A");
			}
			if(PFD0.RawData.GPS.Position.Accuracy != null) {
				ChangeText("Label_PFDTechInfoPositionAccuracy", PFD0.RawData.GPS.Position.Accuracy.toFixed(2) + "米");
			} else {
				ChangeText("Label_PFDTechInfoPositionAccuracy", "N/A");
			}
			if(PFD0.RawData.GPS.Speed != null) {
				ChangeText("Label_PFDTechInfoGPSSpeed", PFD0.RawData.GPS.Speed.toFixed(2) + "米/秒");
			} else {
				ChangeText("Label_PFDTechInfoGPSSpeed", "N/A");
			}
			if(PFD0.RawData.GPS.Altitude.Altitude != null) {
				ChangeText("Label_PFDTechInfoGPSAltitude", PFD0.RawData.GPS.Altitude.Altitude.toFixed(2) + "米");
			} else {
				ChangeText("Label_PFDTechInfoGPSAltitude", "N/A");
			}
			if(PFD0.RawData.GPS.Altitude.Accuracy != null) {
				ChangeText("Label_PFDTechInfoAltitudeAccuracy", PFD0.RawData.GPS.Altitude.Accuracy.toFixed(2) + "米");
			} else {
				ChangeText("Label_PFDTechInfoAltitudeAccuracy", "N/A");
			}
			if(PFD0.RawData.GPS.Heading != null) {
				ChangeText("Label_PFDTechInfoHeading", PFD0.RawData.GPS.Heading.toFixed(2) + "度");
			} else {
				ChangeText("Label_PFDTechInfoHeading", "N/A");
			}
			ChangeText("Label_PFDTechInfoGPSTimestamp", PFD0.RawData.GPS.Timestamp + " (+" + (PFD0.Stats.ClockTime - PFD0.RawData.GPS.Timestamp) + ")");

			// Accel
			if(PFD0.RawData.Accel.Accel.Absolute.X != null) {
				ChangeText("Label_PFDTechInfoAbsoluteXAxis", PFD0.RawData.Accel.Accel.Absolute.X.toFixed(2) + "m/s²");
			} else {
				ChangeText("Label_PFDTechInfoAbsoluteXAxis", "N/A");
			}
			if(PFD0.RawData.Accel.Accel.Absolute.Y != null) {
				ChangeText("Label_PFDTechInfoAbsoluteYAxis", PFD0.RawData.Accel.Accel.Absolute.Y.toFixed(2) + "m/s²");
			} else {
				ChangeText("Label_PFDTechInfoAbsoluteYAxis", "N/A");
			}
			if(PFD0.RawData.Accel.Accel.Absolute.Z != null) {
				ChangeText("Label_PFDTechInfoAbsoluteZAxis", PFD0.RawData.Accel.Accel.Absolute.Z.toFixed(2) + "m/s²");
			} else {
				ChangeText("Label_PFDTechInfoAbsoluteZAxis", "N/A");
			}
			if(PFD0.RawData.Accel.Accel.AbsoluteWithGravity.X != null) {
				ChangeText("Label_PFDTechInfoAbsoluteXAxisWithGravity", PFD0.RawData.Accel.Accel.AbsoluteWithGravity.X.toFixed(2) + "m/s²");
			} else {
				ChangeText("Label_PFDTechInfoAbsoluteXAxisWithGravity", "N/A");
			}
			if(PFD0.RawData.Accel.Accel.AbsoluteWithGravity.Y != null) {
				ChangeText("Label_PFDTechInfoAbsoluteYAxisWithGravity", PFD0.RawData.Accel.Accel.AbsoluteWithGravity.Y.toFixed(2) + "m/s²");
			} else {
				ChangeText("Label_PFDTechInfoAbsoluteYAxisWithGravity", "N/A");
			}
			if(PFD0.RawData.Accel.Accel.AbsoluteWithGravity.Z != null) {
				ChangeText("Label_PFDTechInfoAbsoluteZAxisWithGravity", PFD0.RawData.Accel.Accel.AbsoluteWithGravity.Z.toFixed(2) + "m/s²");
			} else {
				ChangeText("Label_PFDTechInfoAbsoluteZAxisWithGravity", "N/A");
			}
			ChangeText("Label_PFDTechInfoScreenOrientation", screen.orientation.type);
			ChangeText("Label_PFDTechInfoRelativeForward", PFD0.RawData.Accel.Accel.Relative.Forward.toFixed(2) + "m/s²");
			ChangeText("Label_PFDTechInfoRelativeRight", PFD0.RawData.Accel.Accel.Relative.Right.toFixed(2) + "m/s²");
			ChangeText("Label_PFDTechInfoRelativeUpward", PFD0.RawData.Accel.Accel.Relative.Upward.toFixed(2) + "m/s²");
			ChangeText("Label_PFDTechInfoRelativeForwardWithGravity", PFD0.RawData.Accel.Accel.RelativeWithGravity.Forward.toFixed(2) + "m/s²");
			ChangeText("Label_PFDTechInfoRelativeRightWithGravity", PFD0.RawData.Accel.Accel.RelativeWithGravity.Right.toFixed(2) + "m/s²");
			ChangeText("Label_PFDTechInfoRelativeUpwardWithGravity", PFD0.RawData.Accel.Accel.RelativeWithGravity.Upward.toFixed(2) + "m/s²");
			ChangeText("Label_PFDTechInfoAlignedForward", PFD0.RawData.Accel.Accel.Aligned.Forward.toFixed(2) + "m/s²");
			ChangeText("Label_PFDTechInfoAlignedRight", PFD0.RawData.Accel.Accel.Aligned.Right.toFixed(2) + "m/s²");
			ChangeText("Label_PFDTechInfoAlignedUpward", PFD0.RawData.Accel.Accel.Aligned.Upward.toFixed(2) + "m/s²");
			ChangeText("Label_PFDTechInfoAccelPitch", PFD0.RawData.Accel.Attitude.Original.Pitch.toFixed(2) + "度");
			ChangeText("Label_PFDTechInfoAccelRoll", PFD0.RawData.Accel.Attitude.Original.Roll.toFixed(2) + "度");
			ChangeText("Label_PFDTechInfoAlignedPitch", PFD0.RawData.Accel.Attitude.Aligned.Pitch.toFixed(2) + "度");
			ChangeText("Label_PFDTechInfoAlignedRoll", PFD0.RawData.Accel.Attitude.Aligned.Roll.toFixed(2) + "度");
			ChangeText("Label_PFDTechInfoSpeedVectorForward", PFD0.RawData.Accel.Speed.Vector.Forward.toFixed(2) + "米/秒");
			ChangeText("Label_PFDTechInfoSpeedVectorRight", PFD0.RawData.Accel.Speed.Vector.Right.toFixed(2) + "米/秒");
			ChangeText("Label_PFDTechInfoSpeedVectorUpward", PFD0.RawData.Accel.Speed.Vector.Upward.toFixed(2) + "米/秒");
			let NeedleAngle = 0, NeedleLength = 0;
			NeedleAngle = RadToDeg(Math.atan2(PFD0.RawData.Accel.Speed.Vector.Forward, PFD0.RawData.Accel.Speed.Vector.Right));
			NeedleLength = Math.sqrt(Math.pow(PFD0.RawData.Accel.Speed.Vector.Right, 2) + Math.pow(PFD0.RawData.Accel.Speed.Vector.Forward, 2)) * 5;
			ChangeTop("Needle_PFDTechInfoSpeedVectorGraph", "calc(50% - " + NeedleLength + "px)");
			ChangeRotate("Needle_PFDTechInfoSpeedVectorGraph", 90 - NeedleAngle);
			ChangeHeight("Needle_PFDTechInfoSpeedVectorGraph", NeedleLength * 2 + "px");
			ChangeText("Label_PFDTechInfoAccelSpeed", PFD0.RawData.Accel.Speed.Speed.toFixed(2) + "米/秒");
			ChangeText("Label_PFDTechInfoAccelAltitude", PFD0.RawData.Accel.Altitude.toFixed(2) + "米");
			if(PFD0.RawData.Accel.Interval != null) {
				ChangeText("Label_PFDTechInfoAccelInterval", PFD0.RawData.Accel.Interval + "毫秒");
			} else {
				ChangeText("Label_PFDTechInfoAccelInterval", "N/A");
			}
			ChangeText("Label_PFDTechInfoAccelTimestamp", PFD0.RawData.Accel.Timestamp + " (+" + (PFD0.Stats.ClockTime - PFD0.RawData.Accel.Timestamp) + ")");

			// Manual
			ChangeText("Label_PFDTechInfoManualPitch", PFD0.RawData.Manual.Attitude.Pitch.toFixed(2) + "度");
			ChangeText("Label_PFDTechInfoManualPitchTrend", PFD0.RawData.Manual.Attitude.PitchTrend.toFixed(2) + "度/秒");
			ChangeText("Label_PFDTechInfoManualRoll", PFD0.RawData.Manual.Attitude.Roll.toFixed(2) + "度");
			ChangeText("Label_PFDTechInfoManualRollTrend", PFD0.RawData.Manual.Attitude.RollTrend.toFixed(2) + "度/秒");
			ChangeText("Label_PFDTechInfoManualSpeed", PFD0.RawData.Manual.Speed.toFixed(2) + "米/秒");
			ChangeText("Label_PFDTechInfoManualSpeedTrend", PFD0.RawData.Manual.SpeedTrend.toFixed(2) + "m/s²");
			ChangeText("Label_PFDTechInfoManualAltitude", PFD0.RawData.Manual.Altitude.toFixed(2) + "米");
			ChangeText("Label_PFDTechInfoManualAltitudeTrend", PFD0.RawData.Manual.AltitudeTrend.toFixed(2) + "米/秒");
			ChangeText("Label_PFDTechInfoManualHeading", PFD0.RawData.Manual.Heading.toFixed(2) + "度");
			ChangeText("Label_PFDTechInfoManualHeadingTrend", PFD0.RawData.Manual.HeadingTrend.toFixed(2) + "度/秒");
		}

	function RefreshPFD() {
		// Call
		RefreshAirportLibrary();
		ClockPFD();

		// PFD
			// Menu
				// Ctrl
					// Manual maneuver
					if((PFD.Attitude.IsEnabled == true && PFD.Attitude.Mode == "Manual") || PFD.Speed.Mode == "Manual" || PFD.Altitude.Mode == "Manual" || PFD.Heading.Mode == "Manual") {
						Show("Ctrl_PFDManualManeuver");
						if(PFD.Attitude.IsEnabled == true && PFD.Attitude.Mode == "Manual") {
							ChangeDisabled("Button_PFDPitchDown", false);
							ChangeDisabled("Button_PFDPitchUp", false);
							ChangeDisabled("Button_PFDRollLeft", false);
							ChangeDisabled("Button_PFDRollRight", false);
							ChangeDisabled("Button_PFDMaintainAttitude", false);
							ChangeDisabled("Button_PFDResetAttitude", false);
						} else {
							ChangeDisabled("Button_PFDPitchDown", true);
							ChangeDisabled("Button_PFDPitchUp", true);
							ChangeDisabled("Button_PFDRollLeft", true);
							ChangeDisabled("Button_PFDRollRight", true);
							ChangeDisabled("Button_PFDMaintainAttitude", true);
							ChangeDisabled("Button_PFDResetAttitude", true);
						}
						if(PFD.Speed.Mode == "Manual") {
							ChangeDisabled("Button_PFDSpeedUp", false);
							ChangeDisabled("Button_PFDSpeedDown", false);
							ChangeDisabled("Button_PFDMaintainSpeed", false);
						} else {
							ChangeDisabled("Button_PFDSpeedUp", true);
							ChangeDisabled("Button_PFDSpeedDown", true);
							ChangeDisabled("Button_PFDMaintainSpeed", true);
						}
						if(PFD.Altitude.Mode == "Manual") {
							ChangeDisabled("Button_PFDAltitudeUp", false);
							ChangeDisabled("Button_PFDAltitudeDown", false);
							ChangeDisabled("Button_PFDMaintainAltitude", false);
						} else {
							ChangeDisabled("Button_PFDAltitudeUp", true);
							ChangeDisabled("Button_PFDAltitudeDown", true);
							ChangeDisabled("Button_PFDMaintainAltitude", true);
						}
						if(PFD.Heading.Mode == "Manual") {
							ChangeDisabled("Button_PFDHeadingLeft", false);
							ChangeDisabled("Button_PFDHeadingRight", false);
							ChangeDisabled("Button_PFDMaintainHeading", false);
						} else {
							ChangeDisabled("Button_PFDHeadingLeft", true);
							ChangeDisabled("Button_PFDHeadingRight", true);
							ChangeDisabled("Button_PFDMaintainHeading", true);
						}
					} else {
						Hide("Ctrl_PFDManualManeuver");
					}

					// MCP
					ChangeChecked("Checkbox_PFDMCPSpeed", PFD.MCP.Speed.IsEnabled);
					switch(PFD.MCP.Speed.Mode) {
						case "IAS":
							switch(Subsystem.I18n.SpeedUnit) {
								case "KilometerPerHour":
									ChangeNumberTextbox("Textbox_PFDMCPSpeed", "0", "999", "1", "0~999");
									break;
								case "MilePerHour":
									ChangeNumberTextbox("Textbox_PFDMCPSpeed", "0", "621", "1", "0~621");
									break;
								case "Knot":
									ChangeNumberTextbox("Textbox_PFDMCPSpeed", "0", "539", "1", "0~539");
									break;
								default:
									AlertSystemError("The value of Subsystem.I18n.SpeedUnit \"" + Subsystem.I18n.SpeedUnit + "\" in function RefreshPFD is invalid.");
									break;
							}
							ChangeValue("Textbox_PFDMCPSpeed", ConvertUnit(PFD.MCP.Speed.IAS, "MeterPerSec", Subsystem.I18n.SpeedUnit).toFixed(0));
							break;
						case "MachNumber":
							ChangeNumberTextbox("Textbox_PFDMCPSpeed", "0", "0.999", "0.01", "0~0.999");
							ChangeValue("Textbox_PFDMCPSpeed", PFD.MCP.Speed.MachNumber.toFixed(3).replace("0.", "."));
							break;
						default:
							AlertSystemError("The value of PFD.MCP.Speed.Mode \"" + PFD.MCP.Speed.Mode + "\" in function RefreshPFD is invalid.");
							break;
					}
					ChangeValue("Combobox_PFDMCPSpeedMode", PFD.MCP.Speed.Mode);
					ChangeChecked("Checkbox_PFDMCPAltitude", PFD.MCP.Altitude.IsEnabled);
					ChangeValue("Textbox_PFDMCPAltitude", ConvertUnit(PFD.MCP.Altitude.Value, "Meter", Subsystem.I18n.AltitudeUnit).toFixed(0));
					ChangeChecked("Checkbox_PFDMCPVerticalSpeed", PFD.MCP.VerticalSpeed.IsEnabled);
					switch(Subsystem.I18n.VerticalSpeedUnit) {
						case "MeterPerSec":
							ChangeValue("Textbox_PFDMCPVerticalSpeed", ConvertUnit(PFD.MCP.VerticalSpeed.Value, "MeterPerSec", Subsystem.I18n.VerticalSpeedUnit).toFixed(1));
							break;
						case "FeetPerMin":
							ChangeValue("Textbox_PFDMCPVerticalSpeed", ConvertUnit(PFD.MCP.VerticalSpeed.Value, "MeterPerSec", Subsystem.I18n.VerticalSpeedUnit).toFixed(0));
							break;
						default:
							AlertSystemError("The value of Subsystem.I18n.VerticalSpeedUnit \"" + Subsystem.I18n.VerticalSpeedUnit + "\" in function RefreshPFD is invalid.");
							break;
					}
					ChangeChecked("Checkbox_PFDMCPHeading", PFD.MCP.Heading.IsEnabled);
					ChangeValue("Textbox_PFDMCPHeading", PFD.MCP.Heading.Value);

					// Flaps
					if(PFD.Flaps > 0) {
						ChangeText("Label_PFDFlaps", PFD.Flaps + "%");
					} else {
						ChangeText("Label_PFDFlaps", Translate("FlapsUp"));
					}
					ChangeValue("Slider_PFDFlaps", PFD.Flaps);

				// Options
				ChangeChecked("Checkbox_PFDOptionsEnableAttitudeIndicator", PFD.Attitude.IsEnabled);
				if(PFD.Attitude.IsEnabled == true) {
					Show("Ctrl_PFDOptionsAttitudeMode");
				} else {
					Hide("Ctrl_PFDOptionsAttitudeMode");
				}
				ChangeValue("Combobox_PFDOptionsAttitudeMode", PFD.Attitude.Mode);
				ChangeValue("Combobox_PFDOptionsSpeedMode", PFD.Speed.Mode);
				ChangeValue("Combobox_PFDOptionsAltitudeMode", PFD.Altitude.Mode);
				ChangeValue("Combobox_PFDOptionsHeadingMode", PFD.Heading.Mode);
				ChangeChecked("Checkbox_PFDOptionsEnableNav", PFD.Nav.IsEnabled);
				ChangeValue("Combobox_PFDOptionsFlightMode", PFD.FlightMode.FlightMode);
				ChangeChecked("Checkbox_PFDOptionsKeepScreenOn", Subsystem.Display.KeepScreenOn);

		// Settings
			// Attitude
			ChangeChecked("Checkbox_SettingsEnableAttitudeIndicator", PFD.Attitude.IsEnabled);
			if(PFD.Attitude.IsEnabled == true) {
				Show("Ctrl_SettingsAttitudeMode");
				ChangeValue("Combobox_SettingsAttitudeMode", PFD.Attitude.Mode);
				switch(PFD.Attitude.Mode) {
					case "Accel":
						Show("Label_SettingsAttitudeOffset");
						Show("Label_SettingsAttitudeOffsetInfo");
						Show("Ctrl_SettingsAttitudeOffsetPitch");
						Show("Ctrl_SettingsAttitudeOffsetRoll");
						ChangeValue("Textbox_SettingsAttitudeOffsetPitch", PFD.Attitude.Offset.Pitch);
						ChangeValue("Textbox_SettingsAttitudeOffsetRoll", PFD.Attitude.Offset.Roll);
						break;
					case "Manual":
						Hide("Label_SettingsAttitudeOffset");
						Hide("Label_SettingsAttitudeOffsetInfo");
						Hide("Ctrl_SettingsAttitudeOffsetPitch");
						Hide("Ctrl_SettingsAttitudeOffsetRoll");
						break;
					default:
						AlertSystemError("The value of PFD.Attitude.Mode \"" + PFD.Attitude.Mode + "\" in function RefreshPFD is invalid.");
						break;
				}
			} else {
				Hide("Ctrl_SettingsAttitudeMode");
				Hide("Label_SettingsAttitudeOffset");
				Hide("Label_SettingsAttitudeOffsetInfo");
				Hide("Ctrl_SettingsAttitudeOffsetPitch");
				Hide("Ctrl_SettingsAttitudeOffsetRoll");
			}

			// Speed
			ChangeValue("Combobox_SettingsSpeedMode", PFD.Speed.Mode);
			ChangeValue("Combobox_SettingsIASAlgorithm", PFD.Speed.IASAlgorithm);
			ChangeValue("Textbox_SettingsWindDirection", PFD.Speed.Wind.Direction);
			ChangeValue("Textbox_SettingsWindSpeed", ConvertUnit(PFD.Speed.Wind.Speed, "MeterPerSec", Subsystem.I18n.SpeedUnit).toFixed(0));
			ChangeValue("Textbox_SettingsV1", ConvertUnit(PFD.Speed.TakeOff.V1, "MeterPerSec", Subsystem.I18n.SpeedUnit).toFixed(0));
			ChangeValue("Textbox_SettingsVR", ConvertUnit(PFD.Speed.TakeOff.VR, "MeterPerSec", Subsystem.I18n.SpeedUnit).toFixed(0));
			switch(true) {
				case PFD.Speed.SpeedLimit.Min == 0 && PFD.Speed.SpeedLimit.MaxOnFlapsUp == 277.5 && PFD.Speed.SpeedLimit.MaxOnFlapsFull == 277.5:
					ChangeValue("Combobox_SettingsSpeedLimitPreset", "NoSpeedLimits");
					break;
				case PFD.Speed.SpeedLimit.Min == 61.728 && PFD.Speed.SpeedLimit.MaxOnFlapsUp == 174.896 && PFD.Speed.SpeedLimit.MaxOnFlapsFull == 83.3328:
					ChangeValue("Combobox_SettingsSpeedLimitPreset", "Boeing737-800");
					break;
				case PFD.Speed.SpeedLimit.Min == 61.728 && PFD.Speed.SpeedLimit.MaxOnFlapsUp == 180.04 && PFD.Speed.SpeedLimit.MaxOnFlapsFull == 91.0488:
					ChangeValue("Combobox_SettingsSpeedLimitPreset", "AirbusA320");
					break;
				case PFD.Speed.SpeedLimit.Min == 0 && PFD.Speed.SpeedLimit.MaxOnFlapsUp == 33.33333 && PFD.Speed.SpeedLimit.MaxOnFlapsFull == 33.33333:
					ChangeValue("Combobox_SettingsSpeedLimitPreset", "GroundVehicle");
					break;
				default:
					ChangeValue("Combobox_SettingsSpeedLimitPreset", "");
					break;
			}
			ChangeValue("Textbox_SettingsSpeedLimitMin", ConvertUnit(PFD.Speed.SpeedLimit.Min, "MeterPerSec", Subsystem.I18n.SpeedUnit).toFixed(0));
			ChangeValue("Textbox_SettingsSpeedLimitMaxOnFlapsUp", ConvertUnit(PFD.Speed.SpeedLimit.MaxOnFlapsUp, "MeterPerSec", Subsystem.I18n.SpeedUnit).toFixed(0));
			ChangeValue("Textbox_SettingsSpeedLimitMaxOnFlapsFull", ConvertUnit(PFD.Speed.SpeedLimit.MaxOnFlapsFull, "MeterPerSec", Subsystem.I18n.SpeedUnit).toFixed(0));

			// Altitude
			ChangeValue("Combobox_SettingsAltitudeMode", PFD.Altitude.Mode);
			ChangeValue("Textbox_SettingsSeatHeight", ConvertUnit(PFD.Altitude.SeatHeight, "Meter", Subsystem.I18n.AltitudeUnit).toFixed(0));

			// Heading
			ChangeValue("Combobox_SettingsHeadingMode", PFD.Heading.Mode);

			// Nav
			ChangeChecked("Checkbox_SettingsEnableNav", PFD.Nav.IsEnabled);
			if(PFD.Nav.IsEnabled == true) {
				Show("Label_SettingsETA");
				Show("Ctrl_SettingsETACalcMethod");
				ChangeValue("Combobox_SettingsETACalcMethod", PFD.Nav.ETACalcMethod);
			} else {
				Hide("Label_SettingsETA");
				Hide("Ctrl_SettingsETACalcMethod");
			}

			// Flight mode
			ChangeValue("Combobox_SettingsFlightMode", PFD.FlightMode.FlightMode);
			ChangeChecked("Checkbox_SettingsAutoSwitchFlightModeAndSwapAirports", PFD.FlightMode.AutoSwitchFlightModeAndSwapAirports);

			// Warning system
			ChangeChecked("Checkbox_SettingsEnableWarningSystem", PFD.WarningSystem.IsEnabled);

		// Save user data
		localStorage.setItem("GPSPFD_PFD", JSON.stringify(PFD));
	}
	function RefreshGPSData(GeolocationAPIData) { // https://www.freecodecamp.org/news/how-to-use-the-javascript-geolocation-api/
		// GPS data
		PFD0.RawData.GPS = {
			Position: {
				Lat: GeolocationAPIData.coords.latitude,
				Lon: GeolocationAPIData.coords.longitude,
				Accuracy: GeolocationAPIData.coords.accuracy
			},
			Speed: GeolocationAPIData.coords.speed,
			Altitude: {
				Altitude: GeolocationAPIData.coords.altitude,
				Accuracy: GeolocationAPIData.coords.altitudeAccuracy
			},
			Heading: GeolocationAPIData.coords.heading,
			Timestamp: GeolocationAPIData.timestamp
		};

		// Replace accel data
		switch(PFD.Speed.Mode) {
			case "GPS":
			case "Accel":
			case "Manual":
				break;
			case "DualChannel":
				if(PFD0.RawData.GPS.Speed != null) {
					let ProportionVertor = 0;
					if(PFD0.RawData.Accel.Speed.Speed > 0) {
						ProportionVertor = {
							Forward: PFD0.RawData.Accel.Speed.Vector.Forward / PFD0.RawData.Accel.Speed.Speed,
							Right: PFD0.RawData.Accel.Speed.Vector.Right / PFD0.RawData.Accel.Speed.Speed,
							Upward: PFD0.RawData.Accel.Speed.Vector.Upward / PFD0.RawData.Accel.Speed.Speed
						};
					} else {
						ProportionVertor = {
							Forward: 0, Right: 0, Upward: 0
						};
					}
					PFD0.RawData.Accel.Speed.Speed = PFD0.RawData.GPS.Speed;
					PFD0.RawData.Accel.Speed.Vector = {
						Forward: PFD0.RawData.Accel.Speed.Speed * ProportionVertor.Forward,
						Right: PFD0.RawData.Accel.Speed.Speed * ProportionVertor.Right,
						Upward: PFD0.RawData.Accel.Speed.Speed * ProportionVertor.Upward
					};
				}
				break;
			default:
				AlertSystemError("The value of PFD.Speed.Mode \"" + PFD.Speed.Mode + "\" in function RefreshGPSData is invalid.");
				break;
		}
		switch(PFD.Altitude.Mode) {
			case "GPS":
			case "Accel":
			case "Manual":
				break;
			case "DualChannel":
				if(PFD0.RawData.GPS.Altitude.Altitude != null) {
					PFD0.RawData.Accel.Altitude = PFD0.RawData.GPS.Altitude.Altitude;
				}
				break;
			default:
				AlertSystemError("The value of PFD.Altitude.Mode \"" + PFD.Altitude.Mode + "\" in function RefreshGPSData is invalid.");
				break;
		}
	}
	function RefreshAccelData(DeviceMotionAPIData) { // https://medium.com/@kamresh485/understanding-the-device-motion-event-api-0ce5b3e252f1
		// Absolute accel
		PFD0.RawData.Accel.Accel.Absolute = {
			X: DeviceMotionAPIData.acceleration.x,
			Y: DeviceMotionAPIData.acceleration.y,
			Z: DeviceMotionAPIData.acceleration.z
		};
		PFD0.RawData.Accel.Accel.AbsoluteWithGravity = {
			X: DeviceMotionAPIData.accelerationIncludingGravity.x,
			Y: DeviceMotionAPIData.accelerationIncludingGravity.y,
			Z: DeviceMotionAPIData.accelerationIncludingGravity.z
		};

		// Interval
		PFD0.RawData.Accel.Interval = DeviceMotionAPIData.interval;

		// Relative accel
		if(IsNullInObject(PFD0.RawData.Accel.Accel.Absolute) == false && IsNullInObject(PFD0.RawData.Accel.Accel.AbsoluteWithGravity) == false) {
			switch(screen.orientation.type) {
				case "landscape-primary":
					PFD0.RawData.Accel.Accel.Relative = {
						Forward: PFD0.RawData.Accel.Accel.Absolute.Z,
						Right: PFD0.RawData.Accel.Accel.Absolute.Y,
						Upward: -PFD0.RawData.Accel.Accel.Absolute.X
					};
					PFD0.RawData.Accel.Accel.RelativeWithGravity = {
						Forward: PFD0.RawData.Accel.Accel.AbsoluteWithGravity.Z,
						Right: PFD0.RawData.Accel.Accel.AbsoluteWithGravity.Y,
						Upward: -PFD0.RawData.Accel.Accel.AbsoluteWithGravity.X
					};
					break;
				case "landscape-secondary":
					PFD0.RawData.Accel.Accel.Relative = {
						Forward: PFD0.RawData.Accel.Accel.Absolute.Z,
						Right: -PFD0.RawData.Accel.Accel.Absolute.Y,
						Upward: PFD0.RawData.Accel.Accel.Absolute.X
					};
					PFD0.RawData.Accel.Accel.RelativeWithGravity = {
						Forward: PFD0.RawData.Accel.Accel.AbsoluteWithGravity.Z,
						Right: -PFD0.RawData.Accel.Accel.AbsoluteWithGravity.Y,
						Upward: PFD0.RawData.Accel.Accel.AbsoluteWithGravity.X
					};
					break;
				case "portrait-primary":
					PFD0.RawData.Accel.Accel.Relative = {
						Forward: PFD0.RawData.Accel.Accel.Absolute.Z,
						Right: -PFD0.RawData.Accel.Accel.Absolute.X,
						Upward: -PFD0.RawData.Accel.Accel.Absolute.Y
					};
					PFD0.RawData.Accel.Accel.RelativeWithGravity = {
						Forward: PFD0.RawData.Accel.Accel.AbsoluteWithGravity.Z,
						Right: -PFD0.RawData.Accel.Accel.AbsoluteWithGravity.X,
						Upward: -PFD0.RawData.Accel.Accel.AbsoluteWithGravity.Y
					};
					break;
				case "portrait-secondary":
					PFD0.RawData.Accel.Accel.Relative = {
						Forward: PFD0.RawData.Accel.Accel.Absolute.Z,
						Right: PFD0.RawData.Accel.Accel.Absolute.X,
						Upward: PFD0.RawData.Accel.Accel.Absolute.Y
					};
					PFD0.RawData.Accel.Accel.RelativeWithGravity = {
						Forward: PFD0.RawData.Accel.Accel.AbsoluteWithGravity.Z,
						Right: PFD0.RawData.Accel.Accel.AbsoluteWithGravity.X,
						Upward: PFD0.RawData.Accel.Accel.AbsoluteWithGravity.Y
					};
					break;
				default:
					AlertSystemError("The value of screen.orientation.type \"" + screen.orientation.type + "\" in function RefreshAccelData is invalid.");
					break;
			}
		}

		// Attitude
		PFD0.RawData.Accel.Attitude.Original = CalcAttitude(PFD0.RawData.Accel.Accel.Relative, PFD0.RawData.Accel.Accel.RelativeWithGravity);
		PFD0.RawData.Accel.Attitude.Aligned = {
			Pitch: PFD0.RawData.Accel.Attitude.Original.Pitch + PFD.Attitude.Offset.Pitch,
			Roll: PFD0.RawData.Accel.Attitude.Original.Roll + PFD.Attitude.Offset.Roll
		};

		// Aligned accel
			// Convert to opposite and align orientation
			PFD0.RawData.Accel.Accel.Aligned = {
				Forward: -PFD0.RawData.Accel.Accel.Relative.Forward * Math.cos(DegToRad(Math.abs(PFD0.RawData.Accel.Attitude.Original.Pitch))),
				Right: -PFD0.RawData.Accel.Accel.Relative.Right * Math.cos(DegToRad(Math.abs(PFD0.RawData.Accel.Attitude.Original.Roll))),
				Upward: -PFD0.RawData.Accel.Accel.Relative.Upward * Math.cos(DegToRad(Math.abs(PFD0.RawData.Accel.Attitude.Original.Roll))) * Math.cos(DegToRad(Math.abs(PFD0.RawData.Accel.Attitude.Original.Pitch)))
			};

			// Reduce sensitivity to prevent incorrect speed inflation
			if(Math.abs(PFD0.RawData.Accel.Accel.Aligned.Forward) < 0.3) {
				PFD0.RawData.Accel.Accel.Aligned.Forward = 0;
			}
			if(Math.abs(PFD0.RawData.Accel.Accel.Aligned.Right) < 0.3) {
				PFD0.RawData.Accel.Accel.Aligned.Right = 0;
			}
			if(Math.abs(PFD0.RawData.Accel.Accel.Aligned.Upward) < 0.3) {
				PFD0.RawData.Accel.Accel.Aligned.Upward = 0;
			}

		// Speed and altitude
		PFD0.RawData.Accel.Speed.Vector = {
			Forward: PFD0.RawData.Accel.Speed.Vector.Forward + PFD0.RawData.Accel.Accel.Aligned.Forward * (PFD0.RawData.Accel.Interval / 1000),
			Right: PFD0.RawData.Accel.Speed.Vector.Right + PFD0.RawData.Accel.Accel.Aligned.Right * (PFD0.RawData.Accel.Interval / 1000),
			Upward: PFD0.RawData.Accel.Speed.Vector.Upward + PFD0.RawData.Accel.Accel.Aligned.Upward * (PFD0.RawData.Accel.Interval / 1000)
		}
		PFD0.RawData.Accel.Speed.Speed = Math.sqrt(Math.pow(PFD0.RawData.Accel.Speed.Vector.Forward, 2) + Math.pow(PFD0.RawData.Accel.Speed.Vector.Right, 2) + Math.pow(PFD0.RawData.Accel.Speed.Vector.Upward, 2));
		PFD0.RawData.Accel.Altitude += PFD0.RawData.Accel.Speed.Vector.Upward * (PFD0.RawData.Accel.Interval / 1000);

		// Timestamp
		PFD0.RawData.Accel.Timestamp = Date.now();
	}
	function ClockAvgSpeeds() {
		// Automation
		clearTimeout(Automation.ClockAvgSpeeds);
		Automation.ClockAvgSpeeds = setTimeout(ClockAvgSpeeds, Automation.ClockRate);

		// Main
		if((PFD.Speed.Mode == "GPS" && PFD0.Status.GPS.IsSpeedAvailable == true) ||
		(PFD.Speed.Mode == "Accel" && PFD0.Status.IsAccelAvailable == true) ||
		(PFD.Speed.Mode == "DualChannel" && (PFD0.Status.GPS.IsSpeedAvailable == true || PFD0.Status.IsAccelAvailable == true)) ||
		PFD.Speed.Mode == "Manual") {
			PFD0.Stats.Speed.SampleCount++;
			PFD0.Stats.Speed.AvgGS = (PFD0.Stats.Speed.AvgGS * (PFD0.Stats.Speed.SampleCount - 1) + PFD0.Stats.Speed.GS) / PFD0.Stats.Speed.SampleCount;
			PFD0.Stats.Speed.AvgIAS = (PFD0.Stats.Speed.AvgIAS * (PFD0.Stats.Speed.SampleCount - 1) + PFD0.Stats.Speed.IAS) / PFD0.Stats.Speed.SampleCount;
		}
	}

	// Airport library
	function RefreshAirportLibrary() {
		// Airports
			// Generate list
			ChangeText("CtrlGroup_AirportLibraryList", "");
			for(let Looper = 1; Looper < AirportLibrary.Airport.length; Looper++) {
				AddText("CtrlGroup_AirportLibraryList",
					"<li class=\"Ctrl\" id=\"Ctrl_AirportLibraryAirport" + Looper + "\">" +
					"	<label class=\"ListItemLabel\" id=\"Label_AirportLibraryAirport" + Looper + "\" for=\"Radiobtn_AirportLibraryAirport" + Looper + "Departure\">" +
					"		<input class=\"Radiobtn\" id=\"Radiobtn_AirportLibraryAirport" + Looper + "Departure\" type=\"radio\" checked=\"false\" onchange=\"SetDepartureAirport(" + Looper + ")\" />" +
					"		<input class=\"Radiobtn\" id=\"Radiobtn_AirportLibraryAirport" + Looper + "Arrival\" type=\"radio\" checked=\"false\" onchange=\"SetArrivalAirport(" + Looper + ")\" />" +
					"		<span class=\"ListItemName\">" + ConvertEmptyName(AirportLibrary.Airport[Looper].Name) + "</span>" +
					"	</label>" +
					"	<button class=\"Button ShownAsLabel ListItemDuplicate\" onclick=\"DuplicateAirport(" + Looper + ")\" title=\"生成副本\" aria-label=\"生成副本\">" +
					"		<svg class=\"Icon Smaller\" viewBox=\"0 0 16 16\" aria-hidden=\"true\">" +
					"			<path d=\"M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z\"/>" +
					"		</svg>" +
					"	</button>" +
					"	<button class=\"Button ShownAsLabel ListItemExport\" onclick=\"ExportAirport(" + Looper + ")\" title=\"导出\" aria-label=\"导出\">" +
					"		<svg class=\"Icon Smaller\" viewBox=\"0 0 16 16\" aria-hidden=\"true\">" +
					"			<path d=\"M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5\"/>" +
					"			<path d=\"M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z\"/>" +
					"		</svg>" +
					"	</button>" +
					"	<button class=\"Button ShownAsLabel ListItemDelete\" id=\"Button_AirportLibraryAirport" + Looper + "Delete\" onclick=\"ConfirmDeleteAirport(" + Looper + ")\" title=\"删除...\" aria-label=\"删除...\">" +
					"		<svg class=\"Icon Smaller\" viewBox=\"0 0 16 16\" aria-hidden=\"true\">" +
					"			<path d=\"M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5\"/>" +
					"		</svg>" +
					"	</button>" +
					"</li>");
			}
			if(AirportLibrary.Airport.length <= 1) {
				AlertSystemError("The airport library is empty.");
			}
			if(AirportLibrary.Airport.length == 2) {
				ChangeDisabled("Button_AirportLibraryAirport1Delete", true);
			}

			// Selection
			for(let Looper = 1; Looper < AirportLibrary.Airport.length; Looper++) {
				if(AirportLibrary.Selection.Departure == Looper) {
					ChangeChecked("Radiobtn_AirportLibraryAirport" + Looper + "Departure", true);
					AddClass("Label_AirportLibraryAirport" + Looper, "Active");
				} else {
					ChangeChecked("Radiobtn_AirportLibraryAirport" + Looper + "Departure", false);
					RemoveClass("Label_AirportLibraryAirport" + Looper, "Active");
				}
				if(AirportLibrary.Selection.Arrival == Looper) {
					ChangeChecked("Radiobtn_AirportLibraryAirport" + Looper + "Arrival", true);
				} else {
					ChangeChecked("Radiobtn_AirportLibraryAirport" + Looper + "Arrival", false);
				}
			}

			// Filter
			FilterAirportLibrary();

		// Airport properties
			// Basic properties
			ChangeValue("Textbox_AirportLibraryName", AirportLibrary.Airport[AirportLibrary.Selection.Departure].Name);
			ChangeValue("Textbox_AirportLibraryRegion", AirportLibrary.Airport[AirportLibrary.Selection.Departure].Region);
			ChangeValue("Textbox_AirportLibraryCode", AirportLibrary.Airport[AirportLibrary.Selection.Departure].Code);

			// Geography
			ChangeValue("Textbox_AirportLibraryLat", AirportLibrary.Airport[AirportLibrary.Selection.Departure].Coordinates.Lat.toFixed(5));
			ChangeValue("Textbox_AirportLibraryLon", AirportLibrary.Airport[AirportLibrary.Selection.Departure].Coordinates.Lon.toFixed(5));
			ChangeValue("Textbox_AirportLibraryElevation", ConvertUnit(AirportLibrary.Airport[AirportLibrary.Selection.Departure].Elevation, "Meter", Subsystem.I18n.AltitudeUnit).toFixed(0));

			// Weather
			ChangeValue("Textbox_AirportLibraryTemperature", ConvertUnit(AirportLibrary.Airport[AirportLibrary.Selection.Departure].Temperature, "Kelvin", Subsystem.I18n.TemperatureUnit).toFixed(0));
			ChangeValue("Textbox_AirportLibraryRelativeHumidity", AirportLibrary.Airport[AirportLibrary.Selection.Departure].RelativeHumidity);
			ChangeValue("Textbox_AirportLibraryQNH", ConvertUnit(AirportLibrary.Airport[AirportLibrary.Selection.Departure].QNH, "Hectopascal", Subsystem.I18n.PressureUnit).toFixed(2));

			// Final approach
			ChangeValue("Textbox_AirportLibraryGlideSlopeAngle", AirportLibrary.Airport[AirportLibrary.Selection.Departure].GlideSlopeAngle.toFixed(2));
			ChangeValue("Textbox_AirportLibraryOuterMarkerDistance", ConvertUnit(AirportLibrary.Airport[AirportLibrary.Selection.Departure].MarkerBeaconDistance.Outer, "Meter", Subsystem.I18n.DistanceUnit).toFixed(2));
			ChangeValue("Textbox_AirportLibraryMiddleMarkerDistance", ConvertUnit(AirportLibrary.Airport[AirportLibrary.Selection.Departure].MarkerBeaconDistance.Middle, "Meter", Subsystem.I18n.DistanceUnit).toFixed(2));
			ChangeValue("Textbox_AirportLibraryInnerMarkerDistance", ConvertUnit(AirportLibrary.Airport[AirportLibrary.Selection.Departure].MarkerBeaconDistance.Inner, "Meter", Subsystem.I18n.DistanceUnit).toFixed(2));
			ChangeValue("Textbox_AirportLibraryDecisionHeight", ConvertUnit(AirportLibrary.Airport[AirportLibrary.Selection.Departure].DecisionHeight, "Meter", Subsystem.I18n.AltitudeUnit).toFixed(0));

		// Save user data
		localStorage.setItem("GPSPFD_AirportLibrary", JSON.stringify(AirportLibrary));
	}

// Cmds
	// PFD
		// Menu
		function ForceHidePFDMenu() {
			setTimeout(function() { // Because the close button is inside the window, clicking the close button also triggers showing the window. So a delay should be set here.
				HideToCorner("Window_PFDMenu");
			}, 40);
		}
		function TogglePFDMenuCollapse(Name) {
			if(IsClassContained("CtrlGroup_PFD" + Name, "Hidden") == true) {
				Show("CtrlGroup_PFD" + Name);
			} else {
				Hide("CtrlGroup_PFD" + Name);
			}
		}
			// Ctrl
				// Manual maneuver
				function PitchDown() {
					PFD0.RawData.Manual.Attitude.PitchTrend = CheckRangeAndCorrect(PFD0.RawData.Manual.Attitude.PitchTrend - 0.25, -50, 50);
				}
				function PitchUp() {
					PFD0.RawData.Manual.Attitude.PitchTrend = CheckRangeAndCorrect(PFD0.RawData.Manual.Attitude.PitchTrend + 0.25, -50, 50);
				}
				function RollLeft() {
					PFD0.RawData.Manual.Attitude.RollTrend = CheckRangeAndCorrect(PFD0.RawData.Manual.Attitude.RollTrend - 0.5, -100, 100);
				}
				function RollRight() {
					PFD0.RawData.Manual.Attitude.RollTrend = CheckRangeAndCorrect(PFD0.RawData.Manual.Attitude.RollTrend + 0.5, -100, 100);
				}
				function MaintainAttitude() {
					PFD0.RawData.Manual.Attitude.PitchTrend = 0;
					PFD0.RawData.Manual.Attitude.RollTrend = 0;
				}
				function ResetAttitude() {
					PFD0.RawData.Manual.Attitude = {
						Pitch: 0, PitchTrend: 0,
						Roll: 0, RollTrend: 0
					};
				}
				function SpeedUp() {
					PFD0.RawData.Manual.SpeedTrend = CheckRangeAndCorrect(PFD0.RawData.Manual.SpeedTrend + 0.10288, -20.576, 20.576);
				}
				function SpeedDown() {
					PFD0.RawData.Manual.SpeedTrend = CheckRangeAndCorrect(PFD0.RawData.Manual.SpeedTrend - 0.10288, -20.576, 20.576);
				}
				function MaintainSpeed() {
					PFD0.RawData.Manual.SpeedTrend = 0;
				}
				function AltitudeUp() {
					PFD0.RawData.Manual.AltitudeTrend = CheckRangeAndCorrect(PFD0.RawData.Manual.AltitudeTrend + 0.67733, -135.46667, 135.46667);
				}
				function AltitudeDown() {
					PFD0.RawData.Manual.AltitudeTrend = CheckRangeAndCorrect(PFD0.RawData.Manual.AltitudeTrend - 0.67733, -135.46667, 135.46667);
				}
				function MaintainAltitude() {
					PFD0.RawData.Manual.AltitudeTrend = 0;
				}
				function HeadingLeft() {
					PFD0.RawData.Manual.HeadingTrend = CheckRangeAndCorrect(PFD0.RawData.Manual.HeadingTrend - 0.5, -100, 100);
				}
				function HeadingRight() {
					PFD0.RawData.Manual.HeadingTrend = CheckRangeAndCorrect(PFD0.RawData.Manual.HeadingTrend + 0.5, -100, 100);
				}
				function MaintainHeading() {
					PFD0.RawData.Manual.HeadingTrend = 0;
				}

				// MCP
				function SetEnableMCPSpeed() {
					PFD.MCP.Speed.IsEnabled = IsChecked("Checkbox_PFDMCPSpeed");
					RefreshPFD();
				}
				function SetMCPSpeed() {
					switch(PFD.MCP.Speed.Mode) {
						case "IAS":
							PFD.MCP.Speed.IAS = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_PFDMCPSpeed")), Subsystem.I18n.SpeedUnit, "MeterPerSec"), 0, 277.5);
							break;
						case "MachNumber":
							PFD.MCP.Speed.MachNumber = CheckRangeAndCorrect(Math.trunc(ReadValue("Textbox_PFDMCPSpeed") * 1000) / 1000, 0, 0.999);
							break;
						default:
							AlertSystemError("The value of PFD.MCP.Speed.Mode \"" + PFD.MCP.Speed.Mode + "\" in function SetMCPSpeed is invalid.");
							break;
					}
					RefreshPFD();
				}
				function SetMCPSpeedMode() {
					PFD.MCP.Speed.Mode = ReadValue("Combobox_PFDMCPSpeedMode");
					RefreshPFD();
				}
				function SetEnableMCPAltitude() {
					PFD.MCP.Altitude.IsEnabled = IsChecked("Checkbox_PFDMCPAltitude");
					RefreshPFD();
				}
				function SetMCPAltitude() {
					PFD.MCP.Altitude.Value = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_PFDMCPAltitude")), Subsystem.I18n.AltitudeUnit, "Meter"), -609.6, 15240);
					RefreshPFD();
				}
				function SetEnableMCPVerticalSpeed() {
					PFD.MCP.VerticalSpeed.IsEnabled = IsChecked("Checkbox_PFDMCPVerticalSpeed");
					RefreshPFD();
				}
				function SetMCPVerticalSpeed() {
					switch(Subsystem.I18n.VerticalSpeedUnit) {
						case "MeterPerSec":
							PFD.MCP.VerticalSpeed.Value = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_PFDMCPVerticalSpeed") * 10) / 10, Subsystem.I18n.VerticalSpeedUnit, "MeterPerSec"), -30.48, 30.48);
							break;
						case "FeetPerMin":
							PFD.MCP.VerticalSpeed.Value = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_PFDMCPVerticalSpeed")), Subsystem.I18n.VerticalSpeedUnit, "MeterPerSec"), -30.48, 30.48);
							break;
						default:
							AlertSystemError("The value of Subsystem.I18n.VerticalSpeedUnit \"" + Subsystem.I18n.VerticalSpeedUnit + "\" in function SetMCPVerticalSpeed is invalid.");
							break;
					}
					RefreshPFD();
				}
				function SetEnableMCPHeading() {
					PFD.MCP.Heading.IsEnabled = IsChecked("Checkbox_PFDMCPHeading");
					RefreshPFD();
				}
				function SetMCPHeading() {
					PFD.MCP.Heading.Value = Math.trunc(ReadValue("Textbox_PFDMCPHeading"));
					if(PFD.MCP.Heading.Value < 0) {
						PFD.MCP.Heading.Value += 360;
					}
					if(PFD.MCP.Heading.Value >= 360) {
						PFD.MCP.Heading.Value -= 360;
					}
					RefreshPFD();
				}

				// Flaps
				function SetFlaps() {
					PFD.Flaps = ReadValue("Slider_PFDFlaps");
					RefreshPFD();
				}

				// Reset speeds
				function ResetAccelSpeed() {
					PFD0.RawData.Accel.Speed.Vector = {
						Forward: 0, Right: 0, Upward: 0
					};
					RefreshPFD();
				}
				function ResetAvgSpeeds() {
					PFD0.Stats.Speed.SampleCount = 0;
					PFD0.Stats.Speed.AvgGS = 0;
					PFD0.Stats.Speed.AvgIAS = 0;
					RefreshPFD();
				}

			// Options
			function SetEnableAttitudeIndicatorAtPFDOptions() {
				PFD.Attitude.IsEnabled = IsChecked("Checkbox_PFDOptionsEnableAttitudeIndicator");
				RefreshPFD();
			}
			function SetAttitudeModeAtPFDOptions() {
				PFD.Attitude.Mode = ReadValue("Combobox_PFDOptionsAttitudeMode");
				RefreshPFD();
			}
			function SetSpeedModeAtPFDOptions() {
				PFD.Speed.Mode = ReadValue("Combobox_PFDOptionsSpeedMode");
				RefreshPFD();
			}
			function SetAltitudeModeAtPFDOptions() {
				PFD.Altitude.Mode = ReadValue("Combobox_PFDOptionsAltitudeMode");
				RefreshPFD();
			}
			function SetHeadingModeAtPFDOptions() {
				PFD.Heading.Mode = ReadValue("Combobox_PFDOptionsHeadingMode");
				RefreshPFD();
			}
			function SetEnableNavAtPFDOptions() {
				PFD.Nav.IsEnabled = IsChecked("Checkbox_PFDOptionsEnableNav");
				RefreshPFD();
			}
			function SetFlightModeAtPFDOptions() {
				PFD.FlightMode.FlightMode = ReadValue("Combobox_PFDOptionsFlightMode");
				PFD0.Stats.FlightModeTimestamp = Date.now();
				RefreshPFD();
			}
			function SetKeepScreenOnAtPFDOptions() {
				Subsystem.Display.KeepScreenOn = IsChecked("Checkbox_PFDOptionsKeepScreenOn");
				RefreshSubsystem();
			}

	// Airport library
		// Filter
		function FilterAirportLibrary() {
			let Counter = 0, Counter2 = 0;
			for(let Looper = 1; Looper < AirportLibrary.Airport.length; Looper++) {
				if(AirportLibrary.Airport[Looper].Name.toLowerCase().includes(ReadValue("Textbox_AirportLibraryFilter").toLowerCase()) == true ||
				AirportLibrary.Airport[Looper].Region.toLowerCase().includes(ReadValue("Textbox_AirportLibraryFilter").toLowerCase()) == true ||
				AirportLibrary.Airport[Looper].Code.toLowerCase().includes(ReadValue("Textbox_AirportLibraryFilter").toLowerCase()) == true) {
					Show("Ctrl_AirportLibraryAirport" + Looper);
					Counter++;
				} else {
					Hide("Ctrl_AirportLibraryAirport" + Looper);
				}
				Counter2++;
			}
			ChangeText("Label_AirportLibraryItemCount", "显示 " + Counter + "/" + Counter2);
		}

		// Airports
		function SetDepartureAirport(Number) {
			AirportLibrary.Selection.Departure = Number;
			RefreshPFD();
		}
		function SetArrivalAirport(Number) {
			AirportLibrary.Selection.Arrival = Number;
			RefreshPFD();
		}
		function DuplicateAirport(Number) {
			AirportLibrary.Airport.splice(Number + 1, 0, structuredClone(AirportLibrary.Airport[Number]));
			if(AirportLibrary.Selection.Departure > Number) {
				AirportLibrary.Selection.Departure++;
			}
			if(AirportLibrary.Selection.Arrival > Number) {
				AirportLibrary.Selection.Arrival++;
			}
			RefreshPFD();
		}
		function ExportAirport(Number) {
			navigator.clipboard.writeText(JSON.stringify(AirportLibrary.Airport[Number]));
			if(System.DontShowAgain.includes("GPSPFD_AirportLibrary_AirportExported") == false) {
				ShowDialog("AirportLibrary_AirportExported",
					"Info",
					"已导出机场「" + ConvertEmptyName(AirportLibrary.Airport[Number].Name) + "」至剪贴板。",
					"不再弹窗提示", "", "", "确定");
			} else {
				ShowToast("已导出机场");
			}
		}
		function ConfirmDeleteAirport(Number) {
			Interaction.Deletion = Number;
			ShowDialog("AirportLibrary_ConfirmDeleteAirport",
				"Caution",
				"您确认要删除机场「" + ConvertEmptyName(AirportLibrary.Airport[Number].Name) + "」？",
				"", "", "删除", "取消");
		}
		function SwapAirports() {
			let Swapper = AirportLibrary.Selection.Departure;
			AirportLibrary.Selection.Departure = AirportLibrary.Selection.Arrival;
			AirportLibrary.Selection.Arrival = Swapper;
			RefreshPFD();
		}
		function NewAirport() {
			AirportLibrary.Airport[AirportLibrary.Airport.length] = {
				Name: "",
				Region: "",
				Code: "",
				Coordinates: {
					Lat: 0, Lon: 0
				},
				Elevation: 0,
				Temperature: 288.15, RelativeHumidity: 50, QNH: 1013.25,
				GlideSlopeAngle: 3,
				MarkerBeaconDistance: {
					Outer: 9260, Middle: 926, Inner: 185.2
				},
				DecisionHeight: 76.2
			};
			AirportLibrary.Selection.Departure = AirportLibrary.Airport.length - 1;
			RefreshPFD();
		}
		function SortByName() {
			for(let Looper = 1; Looper < AirportLibrary.Airport.length - 1; Looper++) {
				for(let Looper2 = 1; Looper2 < AirportLibrary.Airport.length - 1; Looper2++) {
					if(AirportLibrary.Airport[Looper2].Name > AirportLibrary.Airport[Looper2 + 1].Name) {
						let Swapper = structuredClone(AirportLibrary.Airport[Looper2]);
						AirportLibrary.Airport[Looper2] = structuredClone(AirportLibrary.Airport[Looper2 + 1]);
						AirportLibrary.Airport[Looper2 + 1] = structuredClone(Swapper);
						switch(true) {
							case AirportLibrary.Selection.Departure == Looper2:
								AirportLibrary.Selection.Departure++;
								break;
							case AirportLibrary.Selection.Departure == Looper2 + 1:
								AirportLibrary.Selection.Departure--;
								break;
							default:
								break;
						}
						switch(true) {
							case AirportLibrary.Selection.Arrival == Looper2:
								AirportLibrary.Selection.Arrival++;
								break;
							case AirportLibrary.Selection.Arrival == Looper2 + 1:
								AirportLibrary.Selection.Arrival--;
								break;
							default:
								break;
						}
					}
				}
			}
			RefreshPFD();
		}

		// Airport properties
			// Basic properties
			function SetAirportName() {
				AirportLibrary.Airport[AirportLibrary.Selection.Departure].Name = ReadValue("Textbox_AirportLibraryName");
				RefreshAirportLibrary();
			}
			function SetAirportRegion() {
				AirportLibrary.Airport[AirportLibrary.Selection.Departure].Region = ReadValue("Textbox_AirportLibraryRegion");
				RefreshAirportLibrary();
			}
			function SetAirportCode() {
				AirportLibrary.Airport[AirportLibrary.Selection.Departure].Code = ReadValue("Textbox_AirportLibraryCode");
				RefreshAirportLibrary();
			}

			// Geography
			function SetAirportLat() {
				AirportLibrary.Airport[AirportLibrary.Selection.Departure].Coordinates.Lat = CheckRangeAndCorrect(Math.trunc(ReadValue("Textbox_AirportLibraryLat") * 100000) / 100000, -90, 90);
				RefreshPFD();
			}
			function SetAirportLon() {
				AirportLibrary.Airport[AirportLibrary.Selection.Departure].Coordinates.Lon = CheckRangeAndCorrect(Math.trunc(ReadValue("Textbox_AirportLibraryLon") * 100000) / 100000, -180, 180);
				RefreshPFD();
			}
			function ReplaceAirportCoordinatesWithCurrent() {
				AirportLibrary.Airport[AirportLibrary.Selection.Departure].Coordinates = {
					Lat: CheckRangeAndCorrect(PFD0.Stats.Nav.Lat, -90, 90),
					Lon: CheckRangeAndCorrect(PFD0.Stats.Nav.Lon, -180, 180)
				};
				RefreshPFD();
			}
			function SetAirportElevation() {
				AirportLibrary.Airport[AirportLibrary.Selection.Departure].Elevation = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_AirportLibraryElevation")), Subsystem.I18n.AltitudeUnit, "Meter"), -500, 5000);
				RefreshPFD();
			}
			function ReplaceAirportElevationWithCurrent() {
				AirportLibrary.Airport[AirportLibrary.Selection.Departure].Elevation = CheckRangeAndCorrect(PFD0.Stats.Altitude.TapeDisplay - PFD.Altitude.SeatHeight, -500, 5000);
				RefreshPFD();
			}

			// Weather
			function SetAirportTemperature() {
				AirportLibrary.Airport[AirportLibrary.Selection.Departure].Temperature = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_AirportLibraryTemperature")), Subsystem.I18n.TemperatureUnit, "Kelvin"), 223.15, 323.15);
				RefreshPFD();
			}
			function SetAirportRelativeHumidity() {
				AirportLibrary.Airport[AirportLibrary.Selection.Departure].RelativeHumidity = CheckRangeAndCorrect(Math.trunc(ReadValue("Textbox_AirportLibraryRelativeHumidity")), 0, 100);
				RefreshPFD();
			}
			function SetAirportQNH() {
				AirportLibrary.Airport[AirportLibrary.Selection.Departure].QNH = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_AirportLibraryQNH") * 100) / 100, Subsystem.I18n.PressureUnit, "Hectopascal"), 900, 1100);
				RefreshPFD();
			}

			// Final approach
			function SetAirportGlideSlopeAngle() {
				AirportLibrary.Airport[AirportLibrary.Selection.Departure].GlideSlopeAngle = CheckRangeAndCorrect(Math.trunc(ReadValue("Textbox_AirportLibraryGlideSlopeAngle") * 100) / 100, 0, 10);
				RefreshPFD();
			}
			function SetAirportOuterMarkerDistance() {
				AirportLibrary.Airport[AirportLibrary.Selection.Departure].MarkerBeaconDistance.Outer = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_AirportLibraryOuterMarkerDistance") * 100) / 100, Subsystem.I18n.DistanceUnit, "Meter"), 0, 20000);
				RefreshPFD();
			}
			function SetAirportMiddleMarkerDistance() {
				AirportLibrary.Airport[AirportLibrary.Selection.Departure].MarkerBeaconDistance.Middle = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_AirportLibraryMiddleMarkerDistance") * 100) / 100, Subsystem.I18n.DistanceUnit, "Meter"), 0, 20000);
				RefreshPFD();
			}
			function SetAirportInnerMarkerDistance() {
				AirportLibrary.Airport[AirportLibrary.Selection.Departure].MarkerBeaconDistance.Inner = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_AirportLibraryInnerMarkerDistance") * 100) / 100, Subsystem.I18n.DistanceUnit, "Meter"), 0, 20000);
				RefreshPFD();
			}
			function SetAirportDecisionHeight() {
				AirportLibrary.Airport[AirportLibrary.Selection.Departure].DecisionHeight = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_AirportLibraryDecisionHeight")), Subsystem.I18n.AltitudeUnit, "Meter"), 15, 750);
				RefreshPFD();
			}

		// Management
		function ImportAirportLibraryObjects() {
			let Objects = ReadValue("Textbox_AirportLibraryImport").split("\n"), Counter = 0, Counter2 = 0;
			for(let Looper = 0; Looper < Objects.length; Looper++) {
				switch(true) {
					// Airport
					case Objects[Looper].startsWith("{\"Name\":") == true:
						AirportLibrary.Airport[AirportLibrary.Airport.length] = JSON.parse(Objects[Looper]);
						Counter++;
						break;

					// Whole airport library
					case Objects[Looper].startsWith("{\"Selection\":{\"Departure\":") == true:
						AirportLibrary = JSON.parse(Objects[Looper]);
						Counter++;
						break;

					// Empty line
					case Objects[Looper] == "":
						break;

					// Failed to import
					default:
						Counter2++;
						break;
				}
			}
			if(Counter > 0) {
				if(Counter2 <= 0) {
					ShowDialog("AirportLibrary_ObjectsImported",
						"Info",
						"成功导入" + Counter + "个对象。",
						"", "", "", "确定");
				} else {
					ShowDialog("AirportLibrary_ObjectsImported",
						"Info",
						"成功导入" + Counter + "个对象。" + Counter2 + "个对象的 JSON 字符串不合法，无法导入。",
						"", "", "", "确定");
				}
			} else {
				if(ReadValue("Textbox_AirportLibraryImport") != "") {
					ShowDialog("AirportLibrary_ImportFailed",
						"Error",
						"您键入的 JSON 字符串不合法。",
						"", "", "", "确定");
				} else {
					ShowDialog("AirportLibrary_ImportFailed",
						"Error",
						"文本框为空。请先在文本框键入要导入的对象，然后再点击「导入」。",
						"", "", "", "确定");
				}
			}
			ChangeValue("Textbox_AirportLibraryImport", "");
			RefreshPFD();
		}
		function ExportAirportLibrary() {
			navigator.clipboard.writeText(JSON.stringify(AirportLibrary));
			ShowDialog("AirportLibrary_AirportLibraryExported",
				"Info",
				"已导出机场库 (" + (AirportLibrary.Airport.length - 1) + "座机场) 至剪贴板。",
				"", "", "", "确定");
		}
		function ConfirmResetAirportLibrary() {
			ShowDialog("AirportLibrary_ConfirmResetAirportLibrary",
				"Caution",
				"您确认要重置机场库？",
				"", "", "重置", "取消");
		}

	// Settings
		// Attitude
		function SetEnableAttitudeIndicator() {
			PFD.Attitude.IsEnabled = IsChecked("Checkbox_SettingsEnableAttitudeIndicator");
			RefreshPFD();
		}
		function SetAttitudeMode() {
			PFD.Attitude.Mode = ReadValue("Combobox_SettingsAttitudeMode");
			RefreshPFD();
		}
		function SetAttitudeOffsetPitch() {
			PFD.Attitude.Offset.Pitch = CheckRangeAndCorrect(Math.trunc(ReadValue("Textbox_SettingsAttitudeOffsetPitch")), -90, 90);
			RefreshPFD();
		}
		function SetAttitudeOffsetRoll() {
			PFD.Attitude.Offset.Roll = CheckRangeAndCorrect(Math.trunc(ReadValue("Textbox_SettingsAttitudeOffsetRoll")), -90, 90);
			RefreshPFD();
		}

		// Speed
		function SetSpeedMode() {
			PFD.Speed.Mode = ReadValue("Combobox_SettingsSpeedMode");
			RefreshPFD();
		}
		function SetIASAlgorithm() {
			PFD.Speed.IASAlgorithm = ReadValue("Combobox_SettingsIASAlgorithm");
			RefreshPFD();
		}
		function SetWindDirection() {
			PFD.Speed.Wind.Direction = CheckRangeAndCorrect(Math.trunc(ReadValue("Textbox_SettingsWindDirection")), 0, 359);
			RefreshPFD();
		}
		function SetWindSpeed() {
			PFD.Speed.Wind.Speed = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_SettingsWindSpeed")), Subsystem.I18n.SpeedUnit, "MeterPerSec"), 0, 277.5);
			RefreshPFD();
		}
		function SetV1() {
			PFD.Speed.TakeOff.V1 = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_SettingsV1")), Subsystem.I18n.SpeedUnit, "MeterPerSec"), 0, 277.5);
			RefreshPFD();
		}
		function SetVR() {
			PFD.Speed.TakeOff.VR = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_SettingsVR")), Subsystem.I18n.SpeedUnit, "MeterPerSec"), 0, 277.5);
			RefreshPFD();
		}
		function SetSpeedLimitPreset() {
			switch(ReadValue("Combobox_SettingsSpeedLimitPreset")) {
				case "NoSpeedLimits":
					PFD.Speed.SpeedLimit = {
						Min: 0, MaxOnFlapsUp: 277.5, MaxOnFlapsFull: 277.5
					};
					break;
				case "Boeing737-800":
					PFD.Speed.SpeedLimit = {
						Min: 61.728, MaxOnFlapsUp: 174.896, MaxOnFlapsFull: 83.3328
					};
					break;
				case "AirbusA320":
					PFD.Speed.SpeedLimit = {
						Min: 61.728, MaxOnFlapsUp: 180.04, MaxOnFlapsFull: 91.0488
					};
					break;
				case "GroundVehicle":
					PFD.Speed.SpeedLimit = {
						Min: 0, MaxOnFlapsUp: 33.33333, MaxOnFlapsFull: 33.33333
					};
					break;
				default:
					AlertSystemError("The value of ReadValue(\"Combobox_SettingsSpeedLimitPreset\") \"" + ReadValue("Combobox_SettingsSpeedLimitPreset") + "\" in function SetSpeedLimitPreset is invalid.");
					break;
			}
			RefreshPFD();
		}
		function SetSpeedLimitMin() {
			PFD.Speed.SpeedLimit.Min = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_SettingsSpeedLimitMin")), Subsystem.I18n.SpeedUnit, "MeterPerSec"), 0, 272.22222);
			if(PFD.Speed.SpeedLimit.Min > PFD.Speed.SpeedLimit.MaxOnFlapsFull - 5) {
				PFD.Speed.SpeedLimit.MaxOnFlapsFull = PFD.Speed.SpeedLimit.Min + 5;
				if(PFD.Speed.SpeedLimit.MaxOnFlapsFull > PFD.Speed.SpeedLimit.MaxOnFlapsUp) {
					PFD.Speed.SpeedLimit.MaxOnFlapsUp = PFD.Speed.SpeedLimit.MaxOnFlapsFull;
				}
			}
			RefreshPFD();
		}
		function SetSpeedLimitMaxOnFlapsUp() {
			PFD.Speed.SpeedLimit.MaxOnFlapsUp = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_SettingsSpeedLimitMaxOnFlapsUp")), Subsystem.I18n.SpeedUnit, "MeterPerSec"), 5.55556, 277.5);
			if(PFD.Speed.SpeedLimit.MaxOnFlapsUp < PFD.Speed.SpeedLimit.MaxOnFlapsFull) {
				PFD.Speed.SpeedLimit.MaxOnFlapsFull = PFD.Speed.SpeedLimit.MaxOnFlapsUp;
				if(PFD.Speed.SpeedLimit.MaxOnFlapsFull < PFD.Speed.SpeedLimit.Min + 5) {
					PFD.Speed.SpeedLimit.Min = PFD.Speed.SpeedLimit.MaxOnFlapsFull - 5;
				}
			}
			RefreshPFD();
		}
		function SetSpeedLimitMaxOnFlapsFull() {
			PFD.Speed.SpeedLimit.MaxOnFlapsFull = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_SettingsSpeedLimitMaxOnFlapsFull")), Subsystem.I18n.SpeedUnit, "MeterPerSec"), 5.55556, 277.5);
			if(PFD.Speed.SpeedLimit.MaxOnFlapsFull < PFD.Speed.SpeedLimit.Min + 5) {
				PFD.Speed.SpeedLimit.Min = PFD.Speed.SpeedLimit.MaxOnFlapsFull - 5;
			}
			if(PFD.Speed.SpeedLimit.MaxOnFlapsFull > PFD.Speed.SpeedLimit.MaxOnFlapsUp) {
				PFD.Speed.SpeedLimit.MaxOnFlapsUp = PFD.Speed.SpeedLimit.MaxOnFlapsFull;
			}
			RefreshPFD();
		}

		// Altitude
		function SetAltitudeMode() {
			PFD.Altitude.Mode = ReadValue("Combobox_SettingsAltitudeMode");
			RefreshPFD();
		}
		function SetSeatHeight() {
			PFD.Altitude.SeatHeight = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_SettingsSeatHeight")), Subsystem.I18n.AltitudeUnit, "Meter"), 0, 20);
			RefreshPFD();
		}

		// Heading
		function SetHeadingMode() {
			PFD.Heading.Mode = ReadValue("Combobox_SettingsHeadingMode");
			RefreshPFD();
		}

		// Nav
		function SetEnableNav() {
			PFD.Nav.IsEnabled = IsChecked("Checkbox_SettingsEnableNav");
			RefreshPFD();
		}
		function SetETACalcMethod() {
			PFD.Nav.ETACalcMethod = ReadValue("Combobox_SettingsETACalcMethod");
			RefreshPFD();
		}

		// Flight mode
		function SetFlightMode() {
			PFD.FlightMode.FlightMode = ReadValue("Combobox_SettingsFlightMode");
			PFD0.Stats.FlightModeTimestamp = Date.now();
			RefreshPFD();
		}
		function SetAutoSwitchFlightModeAndSwapAirports() {
			PFD.FlightMode.AutoSwitchFlightModeAndSwapAirports = IsChecked("Checkbox_SettingsAutoSwitchFlightModeAndSwapAirports");
			RefreshPFD();
		}

		// Warning system
		function SetEnableWarningSystem() {
			PFD.WarningSystem.IsEnabled = IsChecked("Checkbox_SettingsEnableWarningSystem");
			RefreshPFD();
		}

		// Display
		function SetPFDStyle() {
			Subsystem.Display.PFDStyle = ReadValue("Combobox_SettingsPFDStyle");
			RefreshSubsystem();
			RefreshPFD();
		}
		function SetFlipPFDVertically() {
			Subsystem.Display.FlipPFDVertically = IsChecked("Checkbox_SettingsFlipPFDVertically");
			RefreshSubsystem();
			RefreshPFD();
		}
		function SetKeepScreenOn() {
			Subsystem.Display.KeepScreenOn = IsChecked("Checkbox_SettingsKeepScreenOn");
			RefreshSubsystem();
		}

		// Audio
		function SetAudioScheme() {
			Subsystem.Audio.Scheme = ReadValue("Combobox_SettingsAudioScheme");
			RefreshSubsystem();
		}
		function SetAttitudeAlertVolume() {
			Subsystem.Audio.AttitudeAlertVolume = ReadValue("Slider_SettingsAttitudeAlertVolume");
			RefreshSubsystem();
		}
		function PreviewAttitudeAlertVolume() {
			ChangeAudioLoop("Audio_AttitudeAlert", false);
			PlayAudio("Audio_AttitudeAlert", "../audio/Beep.mp3");
			PFD0.Alert.NowPlaying.AttitudeWarning = "";
		}
		function SetSpeedAlertVolume() {
			Subsystem.Audio.SpeedAlertVolume = ReadValue("Slider_SettingsSpeedAlertVolume");
			RefreshSubsystem();
		}
		function PreviewSpeedAlertVolume() {
			ChangeAudioLoop("Audio_SpeedAlert", false);
			PlayAudio("Audio_SpeedAlert", "../audio/Beep.mp3");
			PFD0.Alert.NowPlaying.SpeedWarning = "";
		}
		function SetAltitudeAlertVolume() {
			Subsystem.Audio.AltitudeAlertVolume = ReadValue("Slider_SettingsAltitudeAlertVolume");
			RefreshSubsystem();
		}
		function PreviewAltitudeAlertVolume() {
			ChangeAudioLoop("Audio_AltitudeAlert", false);
			PlayAudio("Audio_AltitudeAlert", "../audio/Beep.mp3");
			PFD0.Alert.NowPlaying.AltitudeCallout = "";
			PFD0.Alert.NowPlaying.AltitudeWarning = "";
		}

		// I18n
		function SetAlwaysUseEnglishTerminologyOnPFD() {
			Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD = IsChecked("Checkbox_SettingsAlwaysUseEnglishTerminologyOnPFD");
			RefreshSubsystem();
			RefreshPFD();
		}
		function SetMeasurementUnitsPreset() {
			switch(ReadValue("Combobox_SettingsMeasurementUnitsPreset")) {
				case "AllMetric":
					Subsystem.I18n.SpeedUnit = "KilometerPerHour";
					Subsystem.I18n.DistanceUnit = "Kilometer";
					Subsystem.I18n.AltitudeUnit = "Meter";
					Subsystem.I18n.VerticalSpeedUnit = "MeterPerSec";
					Subsystem.I18n.PressureUnit = "Hectopascal";
					Subsystem.I18n.TemperatureUnit = "Celsius";
					break;
				case "CivilAviation":
					Subsystem.I18n.SpeedUnit = "Knot";
					Subsystem.I18n.DistanceUnit = "NauticalMile";
					Subsystem.I18n.AltitudeUnit = "Feet";
					Subsystem.I18n.VerticalSpeedUnit = "FeetPerMin";
					Subsystem.I18n.PressureUnit = "Hectopascal";
					Subsystem.I18n.TemperatureUnit = "Celsius";
					break;
				default:
					AlertSystemError("The value of ReadValue(\"Combobox_SettingsMeasurementUnitsPreset\") \"" + ReadValue("Combobox_SettingsMeasurementUnitsPreset") + "\" in function SetMeasurementUnitsPreset is invalid.");
					break;
			}
			RefreshSubsystem();
			RefreshPFD();
		}
		function SetSpeedUnit() {
			Subsystem.I18n.SpeedUnit = ReadValue("Combobox_SettingsSpeedUnit");
			RefreshSubsystem();
			RefreshPFD();
		}
		function SetDistanceUnit() {
			Subsystem.I18n.DistanceUnit = ReadValue("Combobox_SettingsDistanceUnit");
			RefreshSubsystem();
			RefreshPFD();
		}
		function SetAltitudeUnit() {
			Subsystem.I18n.AltitudeUnit = ReadValue("Combobox_SettingsAltitudeUnit");
			RefreshSubsystem();
			RefreshPFD();
		}
		function SetVerticalSpeedUnit() {
			Subsystem.I18n.VerticalSpeedUnit = ReadValue("Combobox_SettingsVerticalSpeedUnit");
			RefreshSubsystem();
			RefreshPFD();
		}
		function SetTemperatureUnit() {
			Subsystem.I18n.TemperatureUnit = ReadValue("Combobox_SettingsTemperatureUnit");
			RefreshSubsystem();
			RefreshPFD();
		}
		function SetPressureUnit() {
			Subsystem.I18n.PressureUnit = ReadValue("Combobox_SettingsPressureUnit");
			RefreshSubsystem();
			RefreshPFD();
		}

		// Misc
		function ResetAllDontShowAgainDialogs() {
			System.DontShowAgain = [0];
			RefreshSystem();
			ShowToast("已重置");
		}

		// Dev
		function SetVideoFootageMode() {
			Subsystem.Dev.VideoFootageMode = IsChecked("Checkbox_SettingsVideoFootageMode");
			RefreshSubsystem();
		}

		// User data
		function ImportUserData() {
			if(ReadValue("Textbox_SettingsUserDataImport") != "") {
				if(ReadValue("Textbox_SettingsUserDataImport").startsWith("{\"System\":{\"Display\":{\"Theme\":") == true) {
					let UserData = JSON.parse(ReadValue("Textbox_SettingsUserDataImport"));
					Object.keys(UserData).forEach(function(SubobjectName) {
						localStorage.setItem(SubobjectName, JSON.stringify(UserData[SubobjectName]));
					});
					RefreshWebpage();
				} else {
					ShowDialog("System_JSONStringInvalid",
						"Error",
						"您键入的 JSON 字符串不合法。",
						"", "", "", "确定");
					RefreshSystem();
				}
			}
		}
		function ExportUserData() {
			navigator.clipboard.writeText("{" +
				"\"System\":" + JSON.stringify(System) + "," +
				"\"GPSPFD_Subsystem\":" + JSON.stringify(Subsystem) + "," +
				"\"GPSPFD_PFD\":" + JSON.stringify(PFD) + "," +
				"\"GPSPFD_AirportLibrary\":" + JSON.stringify(AirportLibrary) +
				"}");
			ShowDialog("System_UserDataExported",
				"Info",
				"已导出本网页的用户数据至剪贴板。",
				"", "", "", "确定");
		}
		function ConfirmClearUserData() {
			ShowDialog("System_ConfirmClearUserData",
				"Caution",
				"您确认要清空用户数据？",
				"", "", "清空", "取消");
		}

	// Dialog
	function AnswerDialog(Selector) {
		let DialogEvent = Interaction.Dialog[Interaction.Dialog.length - 1].Event;
		ShowDialog("Previous");
		switch(DialogEvent) {
			case "System_LanguageUnsupported":
			case "System_MajorUpdateDetected":
			case "System_PWANewVersionReady":
			case "System_RefreshingWebpage":
			case "System_JSONStringInvalid":
			case "System_UserDataExported":
			case "AirportLibrary_ObjectsImported":
			case "AirportLibrary_ImportFailed":
			case "AirportLibrary_AirportLibraryExported":
				switch(Selector) {
					case 3:
						break;
					default:
						AlertSystemError("The value of Selector \"" + Selector + "\" in function AnswerDialog is invalid.");
						break;
				}
				break;
			case "System_Welcome":
				switch(Selector) {
					case 2:
						if(IsChecked("Checkbox_DialogCheckboxOption") == true) {
							System.DontShowAgain[System.DontShowAgain.length] = "GPSPFD_System_Welcome";
							RefreshSystem();
						}
						ScrollIntoView("Item_HelpReadBeforeUse");
						ShowIAmHere("Item_HelpReadBeforeUse");
						break;
					case 3:
						if(IsChecked("Checkbox_DialogCheckboxOption") == true) {
							System.DontShowAgain[System.DontShowAgain.length] = "GPSPFD_System_Welcome";
							RefreshSystem();
						}
						break;
					default:
						AlertSystemError("The value of Selector \"" + Selector + "\" in function AnswerDialog is invalid.");
						break;
				}
				break;
			case "System_ConfirmGoToTutorial":
				switch(Selector) {
					case 2:
						ScrollIntoView("Item_HelpTutorial");
						ShowIAmHere("Item_HelpTutorial");
						break;
					case 3:
						break;
					default:
						AlertSystemError("The value of Selector \"" + Selector + "\" in function AnswerDialog is invalid.");
						break;
				}
				break;
			case "System_ConfirmClearUserData":
				switch(Selector) {
					case 2:
						localStorage.clear();
						RefreshWebpage();
						break;
					case 3:
						break;
					default:
						AlertSystemError("The value of Selector \"" + Selector + "\" in function AnswerDialog is invalid.");
						break;
				}
				break;
			case "System_Error":
				switch(Selector) {
					case 1:
						ScrollIntoView("Item_SettingsUserData");
						ShowIAmHere("Item_SettingsUserData");
						break;
					case 2:
						ForceStop();
						break;
					case 3:
						break;
					default:
						AlertSystemError("The value of Selector \"" + Selector + "\" in function AnswerDialog is invalid.");
						break;
				}
				break;
			case "AirportLibrary_AirportExported":
				switch(Selector) {
					case 3:
						if(IsChecked("Checkbox_DialogCheckboxOption") == true) {
							System.DontShowAgain[System.DontShowAgain.length] = "GPSPFD_AirportLibrary_AirportExported";
							RefreshSystem();
						}
						break;
					default:
						AlertSystemError("The value of Selector \"" + Selector + "\" in function AnswerDialog is invalid.");
						break;
				}
				break;
			case "AirportLibrary_ConfirmDeleteAirport":
				switch(Selector) {
					case 2:
						if(AirportLibrary.Selection.Departure >= Interaction.Deletion && AirportLibrary.Selection.Departure > 1) {
							AirportLibrary.Selection.Departure--;
						}
						if(AirportLibrary.Selection.Arrival >= Interaction.Deletion && AirportLibrary.Selection.Arrival > 1) {
							AirportLibrary.Selection.Arrival--;
						}
						AirportLibrary.Airport.splice(Interaction.Deletion, 1);
						Interaction.Deletion = 0;
						RefreshPFD();
						break;
					case 3:
						break;
					default:
						AlertSystemError("The value of Selector \"" + Selector + "\" in function AnswerDialog is invalid.");
						break;
				}
				break;
			case "AirportLibrary_ConfirmResetAirportLibrary":
				switch(Selector) {
					case 2:
						localStorage.removeItem("GPSPFD_AirportLibrary");
						RefreshWebpage();
						break;
					case 3:
						break;
					default:
						AlertSystemError("The value of Selector \"" + Selector + "\" in function AnswerDialog is invalid.");
						break;
				}
				break;
			default:
				AlertSystemError("The value of DialogEvent \"" + DialogEvent + "\" in function AnswerDialog is invalid.");
				break;
		}
	}

// Listeners
	// On click (mouse left button, Enter key or Space key)
	document.addEventListener("click", function() {
		setTimeout(function() {
			HideToCorner("Window_PFDMenu");
		}, 0);
	});

	// On keyboard
	document.addEventListener("keydown", function(Hotkey) {
		if(Hotkey.key == "Escape") {
			HideToCorner("Window_PFDMenu");
		}
		if(Hotkey.key == "F1") {
			ShowDialog("System_ConfirmGoToTutorial",
				"Question",
				"您按下了 F1 键。是否前往教程？",
				"", "", "前往", "取消");
			if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
				ShowHotkeyIndicators();
			}
		}
		if((document.activeElement.tagName.toLowerCase() != "input" && document.activeElement.tagName.toLowerCase() != "textarea")) { // Prevent hotkey activation when inputing text etc.
			switch(Hotkey.key.toUpperCase()) {
				// Menu
				case "M":
					Click("Button_PFDMenu");
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;

				// Fullscreen
				case "T":
					ToggleFullscreen();
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;

				// Manual maneuver
				case "W":
					if(PFD.Attitude.IsEnabled == true && PFD.Attitude.Mode == "Manual") {
						PitchDown();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "S":
					if(PFD.Attitude.IsEnabled == true && PFD.Attitude.Mode == "Manual") {
						PitchUp();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "A":
					if(PFD.Attitude.IsEnabled == true && PFD.Attitude.Mode == "Manual") {
						RollLeft();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "D":
					if(PFD.Attitude.IsEnabled == true && PFD.Attitude.Mode == "Manual") {
						RollRight();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "E":
					if(PFD.Attitude.IsEnabled == true && PFD.Attitude.Mode == "Manual") {
						MaintainAttitude();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "Q":
					if(PFD.Attitude.IsEnabled == true && PFD.Attitude.Mode == "Manual") {
						ResetAttitude();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "U":
					if(PFD.Speed.Mode == "Manual") {
						SpeedUp();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "J":
					if(PFD.Speed.Mode == "Manual") {
						SpeedDown();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "I":
					if(PFD.Speed.Mode == "Manual") {
						MaintainSpeed();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "O":
					if(PFD.Altitude.Mode == "Manual") {
						AltitudeUp();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "L":
					if(PFD.Altitude.Mode == "Manual") {
						AltitudeDown();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "P":
					if(PFD.Altitude.Mode == "Manual") {
						MaintainAltitude();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "G":
					if(PFD.Heading.Mode == "Manual") {
						HeadingLeft();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "H":
					if(PFD.Heading.Mode == "Manual") {
						HeadingRight();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "Y":
					if(PFD.Heading.Mode == "Manual") {
						MaintainHeading();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;

				// MCP
				case "Z":
					if(PFD.MCP.Speed.IsEnabled == true) {
						switch(PFD.MCP.Speed.Mode) {
							case "IAS":
								PFD.MCP.Speed.IAS = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_PFDMCPSpeed")) - 1, Subsystem.I18n.SpeedUnit, "MeterPerSec"), 0, 277.5);
								break;
							case "MachNumber":
								PFD.MCP.Speed.MachNumber = CheckRangeAndCorrect(Math.trunc(ReadValue("Textbox_PFDMCPSpeed") * 1000) / 1000 - 0.01, 0, 0.999);
								break;
							default:
								AlertSystemError("The value of PFD.MCP.Speed.Mode \"" + PFD.MCP.Speed.Mode + "\" in function Keydown Event Listener is invalid.");
								break;
						}
						RefreshPFD();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "X":
					if(PFD.MCP.Speed.IsEnabled == true) {
						switch(PFD.MCP.Speed.Mode) {
							case "IAS":
								PFD.MCP.Speed.IAS = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_PFDMCPSpeed")) + 1, Subsystem.I18n.SpeedUnit, "MeterPerSec"), 0, 277.5);
								break;
							case "MachNumber":
								PFD.MCP.Speed.MachNumber = CheckRangeAndCorrect(Math.trunc(ReadValue("Textbox_PFDMCPSpeed") * 1000) / 1000 + 0.01, 0, 0.999);
								break;
							default:
								AlertSystemError("The value of PFD.MCP.Speed.Mode \"" + PFD.MCP.Speed.Mode + "\" in function Keydown Event Listener is invalid.");
								break;
						}
						RefreshPFD();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "B":
					if(PFD.MCP.Altitude.IsEnabled == true) {
						switch(Subsystem.I18n.AltitudeUnit) {
							case "Meter":
								PFD.MCP.Altitude.Value = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_PFDMCPAltitude")) - 50, Subsystem.I18n.AltitudeUnit, "Meter"), -609.6, 15240);
								break;
							case "Feet":
							case "FeetButShowMeterBeside":
								PFD.MCP.Altitude.Value = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_PFDMCPAltitude")) - 100, Subsystem.I18n.AltitudeUnit, "Meter"), -609.6, 15240);
								break;
							default:
								AlertSystemError("The value of Subsystem.I18n.AltitudeUnit \"" + Subsystem.I18n.AltitudeUnit + "\" in function Keydown Event Listener is invalid.");
								break;
						}
						RefreshPFD();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "N":
					if(PFD.MCP.Altitude.IsEnabled == true) {
						switch(Subsystem.I18n.AltitudeUnit) {
							case "Meter":
								PFD.MCP.Altitude.Value = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_PFDMCPAltitude")) + 50, Subsystem.I18n.AltitudeUnit, "Meter"), -609.6, 15240);
								break;
							case "Feet":
							case "FeetButShowMeterBeside":
								PFD.MCP.Altitude.Value = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_PFDMCPAltitude")) + 100, Subsystem.I18n.AltitudeUnit, "Meter"), -609.6, 15240);
								break;
							default:
								AlertSystemError("The value of Subsystem.I18n.AltitudeUnit \"" + Subsystem.I18n.AltitudeUnit + "\" in function Keydown Event Listener is invalid.");
								break;
						}
						RefreshPFD();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "K":
					if(PFD.MCP.VerticalSpeed.IsEnabled == true) {
						switch(Subsystem.I18n.VerticalSpeedUnit) {
							case "MeterPerSec":
								PFD.MCP.VerticalSpeed.Value = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_PFDMCPVerticalSpeed") * 10) / 10 - 1, Subsystem.I18n.VerticalSpeedUnit, "MeterPerSec"), -30.48, 30.48);
								break;
							case "FeetPerMin":
								PFD.MCP.VerticalSpeed.Value = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_PFDMCPVerticalSpeed")) - 100, Subsystem.I18n.VerticalSpeedUnit, "MeterPerSec"), -30.48, 30.48);
								break;
							default:
								AlertSystemError("The value of Subsystem.I18n.VerticalSpeedUnit \"" + Subsystem.I18n.VerticalSpeedUnit + "\" in function Keydown Event Listener is invalid.");
								break;
						}
						RefreshPFD();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case ",":
					if(PFD.MCP.VerticalSpeed.IsEnabled == true) {
						switch(Subsystem.I18n.VerticalSpeedUnit) {
							case "MeterPerSec":
								PFD.MCP.VerticalSpeed.Value = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_PFDMCPVerticalSpeed") * 10) / 10 + 1, Subsystem.I18n.VerticalSpeedUnit, "MeterPerSec"), -30.48, 30.48);
								break;
							case "FeetPerMin":
								PFD.MCP.VerticalSpeed.Value = CheckRangeAndCorrect(ConvertUnit(Math.trunc(ReadValue("Textbox_PFDMCPVerticalSpeed")) + 100, Subsystem.I18n.VerticalSpeedUnit, "MeterPerSec"), -30.48, 30.48);
								break;
							default:
								AlertSystemError("The value of Subsystem.I18n.VerticalSpeedUnit \"" + Subsystem.I18n.VerticalSpeedUnit + "\" in function Keydown Event Listener is invalid.");
								break;
						}
						RefreshPFD();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "C":
					if(PFD.MCP.Heading.IsEnabled == true) {
						PFD.MCP.Heading.Value = Math.trunc(ReadValue("Textbox_PFDMCPHeading")) - 1;
						if(PFD.MCP.Heading.Value < 0) {
							PFD.MCP.Heading.Value += 360;
						}
						if(PFD.MCP.Heading.Value >= 360) {
							PFD.MCP.Heading.Value -= 360;
						}
						RefreshPFD();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "V":
					if(PFD.MCP.Heading.IsEnabled == true) {
						PFD.MCP.Heading.Value = Math.trunc(ReadValue("Textbox_PFDMCPHeading")) + 1;
						if(PFD.MCP.Heading.Value < 0) {
							PFD.MCP.Heading.Value += 360;
						}
						if(PFD.MCP.Heading.Value >= 360) {
							PFD.MCP.Heading.Value -= 360;
						}
						RefreshPFD();
					}
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;

				// Flaps
				case "R":
					PFD.Flaps = CheckRangeAndCorrect(PFD.Flaps - 1, 0, 100);
					RefreshPFD();
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
				case "F":
					PFD.Flaps = CheckRangeAndCorrect(PFD.Flaps + 1, 0, 100);
					RefreshPFD();
					if(System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;

				// Wrong key press
				default:
					if((System.Display.HotkeyIndicators == "ShowOnWrongKeyPress" && IsWrongKeyNegligible(Hotkey.key) == false && Hotkey.key != "F1") ||
					System.Display.HotkeyIndicators == "ShowOnAnyKeyPress" || System.Display.HotkeyIndicators == "AlwaysShow") {
						ShowHotkeyIndicators();
					}
					break;
			}
		}
	});

	// On resizing window
	window.addEventListener("resize", ClockPFD);

	// Geolocation API
	navigator.geolocation.watchPosition(RefreshGPSData, null, GeolocationAPIOptions);

	// Device motion API
	window.addEventListener("devicemotion", RefreshAccelData);

// Features
	// Converters
	function ConvertEmptyName(Value) {
		if(Value != "") {
			return Value;
		} else {
			return "(未命名)";
		}
	}
	function ConvertUnit(Value, InputUnit, OutputUnit) {
		if(InputUnit != OutputUnit) {
			switch(InputUnit) {
				case "Meter":
					switch(OutputUnit) {
						case "Kilometer":
							Value /= 1000;
							break;
						case "Feet":
						case "FeetButShowMeterBeside":
							Value *= 3.28084;
							break;
						case "Mile":
							Value /= 1609.344;
							break;
						case "NauticalMile":
							Value /= 1852;
							break;
						default:
							AlertSystemError("The value of OutputUnit \"" + OutputUnit + "\" in function ConvertUnit is invalid.");
							break;
					}
					break;
				case "Kilometer":
					switch(OutputUnit) {
						case "Meter":
							Value *= 1000;
							break;
						case "Feet":
						case "FeetButShowMeterBeside":
							Value *= 3280.83990;
							break;
						case "Mile":
							Value /= 1.60934;
							break;
						case "NauticalMile":
							Value /= 1.852;
							break;
						default:
							AlertSystemError("The value of OutputUnit \"" + OutputUnit + "\" in function ConvertUnit is invalid.");
							break;
					}
					break;
				case "Feet":
				case "FeetButShowMeterBeside":
					switch(OutputUnit) {
						case "Meter":
							Value /= 3.28084;
							break;
						case "Kilometer":
							Value /= 3280.83990;
							break;
						case "Mile":
							Value /= 5280;
							break;
						case "NauticalMile":
							Value /= 6076.11549;
							break;
						default:
							AlertSystemError("The value of OutputUnit \"" + OutputUnit + "\" in function ConvertUnit is invalid.");
							break;
					}
					break;
				case "Mile":
					switch(OutputUnit) {
						case "Meter":
							Value *= 1609.344;
							break;
						case "Kilometer":
							Value *= 1.60934;
							break;
						case "Feet":
						case "FeetButShowMeterBeside":
							Value *= 5280;
							break;
						case "NauticalMile":
							Value /= 1.15078;
							break;
						default:
							AlertSystemError("The value of OutputUnit \"" + OutputUnit + "\" in function ConvertUnit is invalid.");
							break;
					}
					break;
				case "NauticalMile":
					switch(OutputUnit) {
						case "Meter":
							Value *= 1852;
							break;
						case "Kilometer":
							Value *= 1.852;
							break;
						case "Feet":
						case "FeetButShowMeterBeside":
							Value *= 6076.11549;
							break;
						case "Mile":
							Value *= 1.15078;
							break;
						default:
							AlertSystemError("The value of OutputUnit \"" + OutputUnit + "\" in function ConvertUnit is invalid.");
							break;
					}
					break;
				case "MeterPerSec":
					switch(OutputUnit) {
						case "KilometerPerHour":
							Value *= 3.6;
							break;
						case "FeetPerMin":
							Value *= 196.85039;
							break;
						case "MilePerHour":
							Value *= 2.23694;
							break;
						case "Knot":
							Value *= 1.94384;
							break;
						default:
							AlertSystemError("The value of OutputUnit \"" + OutputUnit + "\" in function ConvertUnit is invalid.");
							break;
					}
					break;
				case "KilometerPerHour":
					switch(OutputUnit) {
						case "MeterPerSec":
							Value /= 3.6;
							break;
						case "FeetPerMin":
							Value *= 54.68066;
							break;
						case "MilePerHour":
							Value /= 1.60934;
							break;
						case "Knot":
							Value /= 1.852;
							break;
						default:
							AlertSystemError("The value of OutputUnit \"" + OutputUnit + "\" in function ConvertUnit is invalid.");
							break;
					}
					break;
				case "FeetPerMin":
					switch(OutputUnit) {
						case "MeterPerSec":
							Value /= 196.85039;
							break;
						case "KilometerPerHour":
							Value /= 54.68066;
							break;
						case "MilePerHour":
							Value /= 88;
							break;
						case "Knot":
							Value /= 101.26859;
							break;
						default:
							AlertSystemError("The value of OutputUnit \"" + OutputUnit + "\" in function ConvertUnit is invalid.");
							break;
					}
					break;
				case "MilePerHour":
					switch(OutputUnit) {
						case "MeterPerSec":
							Value /= 2.23694;
							break;
						case "KilometerPerHour":
							Value *= 1.60934;
							break;
						case "FeetPerMin":
							Value *= 88;
							break;
						case "Knot":
							Value /= 1.15078;
							break;
						default:
							AlertSystemError("The value of OutputUnit \"" + OutputUnit + "\" in function ConvertUnit is invalid.");
							break;
					}
					break;
				case "Knot":
					switch(OutputUnit) {
						case "MeterPerSec":
							Value /= 1.94384;
							break;
						case "KilometerPerHour":
							Value *= 1.852;
							break;
						case "FeetPerMin":
							Value *= 101.26859;
							break;
						case "MilePerHour":
							Value *= 1.15078;
							break;
						default:
							AlertSystemError("The value of OutputUnit \"" + OutputUnit + "\" in function ConvertUnit is invalid.");
							break;
					}
					break;
				case "Kelvin":
					switch(OutputUnit) {
						case "Celsius":
							Value -= 273.15;
							break;
						case "Fahrenheit":
							Value = (Value - 273.15) * 1.8 + 32;
							break;
						default:
							AlertSystemError("The value of OutputUnit \"" + OutputUnit + "\" in function ConvertUnit is invalid.");
							break;
					}
					break;
				case "Celsius":
					switch(OutputUnit) {
						case "Kelvin":
							Value += 273.15;
							break;
						case "Fahrenheit":
							Value = Value * 1.8 + 32;
							break;
						default:
							AlertSystemError("The value of OutputUnit \"" + OutputUnit + "\" in function ConvertUnit is invalid.");
							break;
					}
					break;
				case "Fahrenheit":
					switch(OutputUnit) {
						case "Kelvin":
							Value = (Value - 32) / 1.8 + 273.15;
							break;
						case "Celsius":
							Value = (Value - 32) / 1.8;
							break;
						default:
							AlertSystemError("The value of OutputUnit \"" + OutputUnit + "\" in function ConvertUnit is invalid.");
							break;
					}
					break;
				case "Hectopascal":
					switch(OutputUnit) {
						case "InchOfMercury":
							Value /= 33.86389;
							break;
						default:
							AlertSystemError("The value of OutputUnit \"" + OutputUnit + "\" in function ConvertUnit is invalid.");
							break;
					}
					break;
				case "InchOfMercury":
					switch(OutputUnit) {
						case "Hectopascal":
							Value *= 33.86389;
							break;
						default:
							AlertSystemError("The value of OutputUnit \"" + OutputUnit + "\" in function ConvertUnit is invalid.");
							break;
					}
					break;
				default:
					AlertSystemError("The value of InputUnit \"" + InputUnit + "\" in function ConvertUnit is invalid.");
					break;
			}
		}
		return Math.round(Value * 100000) / 100000;
	}
	function Translate(Value) {
		switch(Value) {
			case "Unknown":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "未知";
				} else {
					return "UNKNOWN";
				}
			case "Normal":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "正常";
				} else {
					return "NORM";
				}
			case "SignalWeak":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "信号弱";
				} else {
					return "WEAK";
				}
			case "Unavailable":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "不可用";
				} else {
					return "UNAVAIL";
				}
			case "NoWind":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "无风";
				} else {
					return "---°/---";
				}
			case "FlapsUp":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "收起";
				} else {
					return "UP";
				}
			case "GPS":
				return "GPS";
			case "Accel":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "加速计";
				} else {
					return "ACCEL";
				}
			case "DualChannel":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "双通道";
				} else {
					return "DUAL CH";
				}
			case "Manual":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "手动";
				} else {
					return "MAN";
				}
			case "DepartureGround":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "出发地面";
				} else {
					return "DEP GND";
				}
			case "TakeOff":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "起飞";
				} else {
					return "T/O";
				}
			case "Cruise":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "巡航";
				} else {
					return "CRZ";
				}
			case "Land":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "降落";
				} else {
					return "LAND";
				}
			case "ArrivalGround":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "到达地面";
				} else {
					return "ARR GND";
				}
			case "EmergencyReturn":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "紧急返航";
				} else {
					return "EMG RTN";
				}
			case "AttitudeUnavailable":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "姿态仪不可用";
				} else {
					return "ATT";
				}
			case "AttitudeDisabled":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "姿态仪已禁用";
				} else {
					return "ATT OFF";
				}
			case "SpeedUnavailable":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "空速表不可用";
				} else {
					return "SPD";
				}
			case "AltitudeUnavailable":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "高度表不可用";
				} else {
					return "ALT";
				}
			case "VerticalSpeedUnavailable":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "垂直速度表不可用";
				} else {
					return "V/S";
				}
			case "HeadingUnavailable":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "朝向指示器不可用";
				} else {
					return "HDG";
				}
			case "DistanceTooFar":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "距离过远";
				} else {
					return "---";
				}
			case "Hour":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "时";
				} else {
					return "H";
				}
			case "Minute":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "分";
				} else {
					return "M";
				}
			case "OuterMarker":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "外";
				} else {
					return "OM";
				}
			case "MiddleMarker":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "中";
				} else {
					return "MM";
				}
			case "InnerMarker":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "内";
				} else {
					return "IM";
				}
			case "BankAngle":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "倾角过大";
				} else {
					return "BANK ANGLE";
				}
			case "AirspeedLow":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "空速过低";
				} else {
					return "SPD LOW";
				}
			case "Overspeed":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "超速";
				} else {
					return "OVERSPEED";
				}
			case "DontSink":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "不要下降";
				} else {
					return "DON'T SINK";
				}
			case "GlideSlope":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "偏离下滑道";
				} else {
					return "G/S";
				}
			case "SinkRate":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "下降率过大";
				} else {
					return "SINK RATE";
				}
			case "PullUp":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "拉杆!";
				} else {
					return "PULL UP!";
				}
			case "KilometerPerHour":
				return "公里/小时";
			case "KilometerPerHourOnPFD":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "公里/小时";
				} else {
					return "KM/H";
				}
			case "MilePerHour":
				return "英里/小时";
			case "MilePerHourOnPFD":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "英里/小时";
				} else {
					return "MPH";
				}
			case "Knot":
				return "节";
			case "KnotOnPFD":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "节";
				} else {
					return "KT";
				}
			case "Kilometer":
				return "公里";
			case "KilometerOnPFD":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "公里";
				} else {
					return "KM";
				}
			case "Mile":
				return "英里";
			case "MileOnPFD":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "英里";
				} else {
					return "MI.";
				}
			case "NauticalMile":
				return "海里";
			case "NauticalMileOnPFD":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "海里";
				} else {
					return "NM";
				}
			case "Meter":
				return "米";
			case "MeterOnPFD":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "米";
				} else {
					return "M";
				}
			case "Feet":
			case "FeetButShowMeterBeside":
				return "英尺";
			case "FeetOnPFD":
			case "FeetButShowMeterBesideOnPFD":
				if(Subsystem.I18n.AlwaysUseEnglishTerminologyOnPFD == false) {
					return "英尺";
				} else {
					return "FT";
				}
			case "MeterPerSec":
				return "米/秒";
			case "FeetPerMin":
				return "英尺/分钟";
			case "Celsius":
				return "℃";
			case "Fahrenheit":
				return "℉";
			case "Hectopascal":
				return "百帕";
			case "InchOfMercury":
				return "英寸汞柱";
			default:
				AlertSystemError("The value of Value \"" + Value + "\" in function Translate is invalid.");
				break;
		}
	}

	// Maths
	function CalcAttitude(AccelVector, AccelVectorWithGravity) { // https://youtube.com/watch?v=p7tjtLkIlFo
		return {
			Pitch: -RadToDeg(Math.asin(CheckRangeAndCorrect((AccelVectorWithGravity.Forward - AccelVector.Forward) / 9.80665, -1, 1))),
			Roll: RadToDeg(Math.atan2(AccelVectorWithGravity.Right - AccelVector.Right, AccelVector.Upward - AccelVectorWithGravity.Upward))
		};
	}
	function CalcTAS(GS, WindRelativeHeading, WindSpeed, VerticalSpeed) {
		let HorizontalTAS = 0, TAS = 0;
		if(WindRelativeHeading != null) {
			HorizontalTAS = GS - WindSpeed * Math.cos(DegToRad(WindRelativeHeading));
		} else {
			HorizontalTAS = GS;
		}
		TAS = Math.sqrt(Math.pow(HorizontalTAS, 2) + Math.pow(VerticalSpeed, 2));
		if(HorizontalTAS < 0) {
			TAS *= -1;
		}
		return TAS;
	}
	function CalcOutsideAirTemperature(Altitude, GroundAltitude, GroundTemperature) { // Air temperature drops 2 Celsius for each 1000 feet. (https://aviation.stackexchange.com/a/44763)
		return GroundTemperature - 2 * ((Altitude - GroundAltitude) / 304.8);
	}
	function CalcOutsideAirPressure(Altitude, QNH, OutsideAirTemperature) { // https://www.omnicalculator.com/physics/air-pressure-at-altitude
		return QNH * Math.pow(Math.E, (-9.80665 * 0.0289644 * Altitude) / (8.31432 * OutsideAirTemperature));
	}
	function CalcOutsideAirDensity(OutsideAirTemperature, OutsideAirPressure, RelativeHumidity) { // https://www.omnicalculator.com/physics/air-density
		let WaterVaporPressure = 0, DryAirPressure = 0, CelsiusTemperature = 0, Calc = 0, Calc2 = 0;
		CelsiusTemperature = ConvertUnit(OutsideAirTemperature, "Kelvin", "Celsius");
		WaterVaporPressure = 6.1078 * Math.pow(10, (7.5 * CelsiusTemperature) / (CelsiusTemperature + 237.3)) * (RelativeHumidity / 100);
		DryAirPressure = OutsideAirPressure - WaterVaporPressure;
		Calc = (DryAirPressure * 100) / (287.058 * OutsideAirTemperature);
		Calc2 = (WaterVaporPressure * 100) / (461.495 * OutsideAirTemperature);
		return Calc + Calc2;
	}
	function CalcIAS(Algorithm, TAS, Altitude, GroundAltitude, GroundTemperature, RelativeHumidity, QNH, IsAttitudeConsidered, RelativePitch) { // https://aerotoolbox.com/airspeed-conversions/, https://aviation.stackexchange.com/a/25811
		let OutsideAirTemperature = 0, OutsideAirPressure = 0, OutsideAirDensity = 0, IAS = 0;
		switch(Algorithm) {
			case "SimpleAlgorithm":
				IAS = TAS / (1 + 0.02 * (Altitude / 304.8));
				break;
			case "AdvancedAlgorithmA":
				OutsideAirTemperature = CalcOutsideAirTemperature(Altitude, GroundAltitude, GroundTemperature);
				OutsideAirPressure = CalcOutsideAirPressure(Altitude, QNH, OutsideAirTemperature);
				OutsideAirDensity = CalcOutsideAirDensity(OutsideAirTemperature, OutsideAirPressure, RelativeHumidity);
				IAS = TAS * Math.sqrt(OutsideAirDensity / 1.225);
				break;
			case "AdvancedAlgorithmB":
				OutsideAirTemperature = CalcOutsideAirTemperature(Altitude, GroundAltitude, GroundTemperature);
				OutsideAirPressure = CalcOutsideAirPressure(Altitude, QNH, OutsideAirTemperature);
				OutsideAirDensity = CalcOutsideAirDensity(OutsideAirTemperature, OutsideAirPressure, RelativeHumidity);
				IAS = 340.3 * Math.sqrt(5 * (Math.pow(OutsideAirDensity / 2 * Math.pow(TAS, 2) / 101325 + 1, 2 / 7) - 1));
				if(TAS < 0) {
					IAS *= -1;
				}
				break;
			case "UseTASDirectly":
				IAS = TAS;
				break;
			default:
				AlertSystemError("The value of Algorithm \"" + Algorithm + "\" in function CalcIAS is invalid.");
				break;
		}
		if(IsAttitudeConsidered == true) {
			return IAS * Math.cos(DegToRad(RelativePitch));
		} else {
			return IAS;
		}
	}
	function CalcMachNumber(TAS, Altitude, GroundAltitude, GroundTemperature) {
		let OutsideAirTemperature = 0, SoundSpeed = 0;
		OutsideAirTemperature = CalcOutsideAirTemperature(Altitude, GroundAltitude, GroundTemperature);
		SoundSpeed = 331.15 + 0.61 * ConvertUnit(OutsideAirTemperature, "Kelvin", "Celsius");
		return TAS / SoundSpeed;
	}
	function CalcMCPIASFromMachNumber(IASAlgorithm, MachNumber, Altitude, GroundAltitude, GroundTemperature, RelativeHumidity, QNH) {
		let OutsideAirTemperature = 0, SoundSpeed = 0, TAS = 0;
		OutsideAirTemperature = CalcOutsideAirTemperature(Altitude, GroundAltitude, GroundTemperature);
		SoundSpeed = 331.15 + 0.61 * ConvertUnit(OutsideAirTemperature, "Kelvin", "Celsius");
		TAS = SoundSpeed * MachNumber;
		return CalcIAS(IASAlgorithm, TAS, Altitude, GroundAltitude, GroundTemperature, RelativeHumidity, QNH, false, null);
	}
	function CalcMCPMachNumberFromIAS(IASAlgorithm, IAS, Altitude, GroundAltitude, GroundTemperature, RelativeHumidity, QNH) {
		let OutsideAirTemperature = 0, OutsideAirPressure = 0, OutsideAirDensity = 0, TAS = 0;
		switch(IASAlgorithm) {
			case "SimpleAlgorithm":
				TAS = IAS * (1 + 0.02 * (Altitude / 304.8));
				break;
			case "AdvancedAlgorithmA":
				OutsideAirTemperature = CalcOutsideAirTemperature(Altitude, GroundAltitude, GroundTemperature);
				OutsideAirPressure = CalcOutsideAirPressure(Altitude, QNH, OutsideAirTemperature);
				OutsideAirDensity = CalcOutsideAirDensity(OutsideAirTemperature, OutsideAirPressure, RelativeHumidity);
				TAS = IAS / Math.sqrt(OutsideAirDensity / 1.225);
				break;
			case "AdvancedAlgorithmB":
				OutsideAirTemperature = CalcOutsideAirTemperature(Altitude, GroundAltitude, GroundTemperature);
				OutsideAirPressure = CalcOutsideAirPressure(Altitude, QNH, OutsideAirTemperature);
				OutsideAirDensity = CalcOutsideAirDensity(OutsideAirTemperature, OutsideAirPressure, RelativeHumidity);
				TAS = Math.sqrt((Math.pow(Math.pow(IAS / 340.3, 2) / 5 + 1, 7 / 2) - 1) / OutsideAirDensity * 2 * 101325);
				break;
			case "UseTASDirectly":
				TAS = IAS;
				break;
			default:
				AlertSystemError("The value of IASAlgorithm \"" + IASAlgorithm + "\" in function CalcMCPMachNumberFromIAS is invalid.");
				break;
		}
		return CalcMachNumber(TAS, Altitude, GroundAltitude, GroundTemperature);
	}
	function CalcMaxSpeedLimit(MaxSpeedOnFlapsUp, MaxSpeedOnFlapsFull, FlapsPercentage) {
		return MaxSpeedOnFlapsUp - (MaxSpeedOnFlapsUp - MaxSpeedOnFlapsFull) * (FlapsPercentage / 100);
	}
	function CalcDistance(Lat1, Lon1, Lat2, Lon2) { // Haversine formula (https://stackoverflow.com/a/27943)
		let EarthRadius = 6371008.8, Calc = 0, Distance = 0;
		Calc = Math.pow(Math.sin(DegToRad((Lat2 - Lat1) / 2)), 2) + Math.cos(DegToRad(Lat1)) * Math.cos(DegToRad(Lat2)) * Math.pow(Math.sin(DegToRad((Lon2 - Lon1) / 2)), 2);
		Distance = 2 * EarthRadius * Math.atan2(Math.sqrt(Calc), Math.sqrt(1 - Calc));
		return Distance;
	}
	function CalcBearing(Lat1, Lon1, Lat2, Lon2) { // https://www.igismap.com/formula-to-find-bearing-or-heading-angle-between-two-points-latitude-longitude/
		let Calc1 = 0, Calc2 = 0, Bearing = 0;
		Calc1 = Math.cos(DegToRad(Lat2)) * Math.sin(DegToRad(Lon2 - Lon1));
		Calc2 = Math.cos(DegToRad(Lat1)) * Math.sin(DegToRad(Lat2)) - Math.sin(DegToRad(Lat1)) * Math.cos(DegToRad(Lat2)) * Math.cos(DegToRad(Lon2 - Lon1));
		Bearing = RadToDeg(Math.atan2(Calc1, Calc2));
		if(Bearing < 0) {
			Bearing += 360;
		}
		return Bearing;
	}

	// Alerts
	function IsExcessiveBankAngle() {
		if(PFD0.Stats.Altitude.RadioDisplay >= 9.144) { // https://skybrary.aero/articles/bank-angle-awareness
			let Threshold = 10 + 25 * ((PFD0.Stats.Altitude.RadioDisplay - 9.144) / 36.576);
			if(Threshold > 35) {
				Threshold = 35;
			}
			return Math.abs(PFD0.Stats.Attitude.Roll) >= Threshold;
		} else {
			return false;
		}
	}
	function IsV1() {
		switch(PFD.FlightMode.FlightMode) {
			case "DepartureGround":
				return PFD0.Stats.Speed.TapeDisplay >= PFD.Speed.TakeOff.V1 && PFD0.Stats.Speed.PreviousTapeDisplay < PFD.Speed.TakeOff.V1;
			case "TakeOff":
			case "Cruise":
			case "Land":
			case "ArrivalGround":
			case "EmergencyReturn":
				return false;
			default:
				AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function IsAirspeedLow is invalid.");
				break;
		}
	}
	function IsAirspeedLow() {
		switch(PFD.FlightMode.FlightMode) {
			case "DepartureGround":
			case "ArrivalGround":
				return false;
			case "TakeOff":
			case "Cruise":
			case "Land":
			case "EmergencyReturn":
				return PFD0.Stats.Speed.TapeDisplay <= PFD.Speed.SpeedLimit.Min;
			default:
				AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function IsAirspeedLow is invalid.");
				break;
		}
	}
	function IsOverspeed() {
		return PFD0.Stats.Speed.TapeDisplay >= CalcMaxSpeedLimit(PFD.Speed.SpeedLimit.MaxOnFlapsUp, PFD.Speed.SpeedLimit.MaxOnFlapsFull, PFD.Flaps);
	}
	function IsMCPAltitudeReached() {
		if(PFD.MCP.Altitude.IsEnabled == true) {
			switch(PFD.FlightMode.FlightMode) {
				case "DepartureGround":
				case "ArrivalGround":
					return false;
				case "TakeOff":
				case "Cruise":
				case "Land":
				case "EmergencyReturn":
					return (PFD0.Stats.Altitude.TapeDisplay >= PFD.MCP.Altitude.Value && PFD0.Stats.Altitude.PreviousTapeDisplay < PFD.MCP.Altitude.Value) ||
						(PFD0.Stats.Altitude.TapeDisplay <= PFD.MCP.Altitude.Value && PFD0.Stats.Altitude.PreviousTapeDisplay > PFD.MCP.Altitude.Value);
				default:
					AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function IsAirspeedLow is invalid.");
					break;
			}
		} else {
			return false;
		}
	}
	function IsDontSink() {
		switch(PFD.FlightMode.FlightMode) {
			case "DepartureGround":
			case "Cruise":
			case "Land":
			case "ArrivalGround":
			case "EmergencyReturn":
				return false;
			case "TakeOff":
				return PFD0.Stats.Speed.Vertical <= -0.508;
			default:
				AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function IsDontSink is invalid.");
				break;
		}
	}
	function IsExcessivelyBelowGlideSlope() {
		switch(PFD.FlightMode.FlightMode) {
			case "DepartureGround":
			case "TakeOff":
			case "Cruise":
			case "ArrivalGround":
				return false;
			case "Land":
			case "EmergencyReturn":
				if(PFD0.Stats.Altitude.RadioDisplay >= 60.96 && PFD0.Stats.Altitude.RadioDisplay <= 304.8) {
					return PFD0.Stats.Nav.GlideSlopeDeviation < -0.455; // 2 dots (full deviation) is 0.7 degrees. So 1.3 dots is 0.455 degrees.
				} else {
					return false;
				}
			default:
				AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function IsExcessivelyBelowGlideSlope is invalid.");
				break;
		}
	}
	function IsSinkRate() { // https://commons.wikimedia.org/wiki/File:FAA_excessive_sink_rate_graph.svg
		let HeightRange = {
			Min: 0, Max: 0
		};
		switch(true) {
			case PFD0.Stats.Speed.Vertical > -6:
				return false;
			case PFD0.Stats.Speed.Vertical <= -6 && PFD0.Stats.Speed.Vertical > -8:
				HeightRange.Min = 60 - 40 * ((-PFD0.Stats.Speed.Vertical - 6) / 2);
				HeightRange.Max = 60 + 90 * ((-PFD0.Stats.Speed.Vertical - 6) / 2);
				return PFD0.Stats.Altitude.RadioDisplay >= HeightRange.Min && PFD0.Stats.Altitude.RadioDisplay <= HeightRange.Max;
			case PFD0.Stats.Speed.Vertical <= -8 && PFD0.Stats.Speed.Vertical > -30:
				HeightRange.Min = 20 - 10 * ((-PFD0.Stats.Speed.Vertical - 8) / 22);
				HeightRange.Max = 150 + 850 * ((-PFD0.Stats.Speed.Vertical - 8) / 22);
				return PFD0.Stats.Altitude.RadioDisplay >= HeightRange.Min && PFD0.Stats.Altitude.RadioDisplay <= HeightRange.Max;
			case PFD0.Stats.Speed.Vertical <= -30 && PFD0.Stats.Speed.Vertical > -50:
				HeightRange.Min = 10 - 10 * ((-PFD0.Stats.Speed.Vertical - 30) / 20);
				HeightRange.Max = 1000 + 500 * ((-PFD0.Stats.Speed.Vertical - 30) / 20);
				return PFD0.Stats.Altitude.RadioDisplay >= HeightRange.Min && PFD0.Stats.Altitude.RadioDisplay <= HeightRange.Max;
			case PFD0.Stats.Speed.Vertical <= -50:
				HeightRange.Min = 0;
				HeightRange.Max = 1500 + 500 * ((-PFD0.Stats.Speed.Vertical - 50) / 20);
				return PFD0.Stats.Altitude.RadioDisplay >= HeightRange.Min && PFD0.Stats.Altitude.RadioDisplay <= HeightRange.Max;
		}
	}
	function IsSinkRatePullUp() {
		let HeightRange = {
			Min: 0, Max: 0
		};
		switch(true) {
			case PFD0.Stats.Speed.Vertical > -8:
				return false;
			case PFD0.Stats.Speed.Vertical <= -8 && PFD0.Stats.Speed.Vertical > -30:
				HeightRange.Min = 20 - 10 * ((-PFD0.Stats.Speed.Vertical - 8) / 22);
				HeightRange.Max = 60 + 740 * ((-PFD0.Stats.Speed.Vertical - 8) / 22);
				return PFD0.Stats.Altitude.RadioDisplay >= HeightRange.Min && PFD0.Stats.Altitude.RadioDisplay <= HeightRange.Max;
			case PFD0.Stats.Speed.Vertical <= -30 && PFD0.Stats.Speed.Vertical > -50:
				HeightRange.Min = 10 - 10 * ((-PFD0.Stats.Speed.Vertical - 30) / 20);
				HeightRange.Max = 800 + 400 * ((-PFD0.Stats.Speed.Vertical - 30) / 20);
				return PFD0.Stats.Altitude.RadioDisplay >= HeightRange.Min && PFD0.Stats.Altitude.RadioDisplay <= HeightRange.Max;
			case PFD0.Stats.Speed.Vertical <= -50:
				HeightRange.Min = 0;
				HeightRange.Max = 1200 + 400 * ((-PFD0.Stats.Speed.Vertical - 50) / 20);
				return PFD0.Stats.Altitude.RadioDisplay >= HeightRange.Min && PFD0.Stats.Altitude.RadioDisplay <= HeightRange.Max;
		}
	}

// Error handling
function AlertSystemError(Message) {
	console.error("● 系统错误\n" +
		Message);
	ShowDialog("System_Error",
		"Error",
		"抱歉，发生了系统错误。您可尝试清空用户数据来修复错误，或向我提供反馈。若无法关闭对话框，请点击「强制停止」。<br />" +
		"<br />" +
		"错误信息：" + Message,
		"", "了解更多", "强制停止", "关闭");
}
