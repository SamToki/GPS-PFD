// For SamToki.github.io
// Released under GNU GPL v3 open source license.
// © 2023 SAM TOKI STUDIO

// Initialization
	// Declare variables
	"use strict";

	// Repair user data: Solves incompatibility after version updates. A repairer may get removed if older than 24 months.
	function RepairUserData() {
		// Home page
			// v9.00 (2025/12/14)
			// Rename value (Mouse cursor)
			if(localStorage.System != undefined) {
				let System = JSON.parse(localStorage.getItem("System"));
				if(System.Display.Cursor == "Default") {
					System.Display.Cursor = "None";
					localStorage.setItem("System", JSON.stringify(System));
				}
			}

			// v10.00 (2026/02/08)
			// New feature (Fieldset collapsing)
			if(localStorage.System != undefined) {
				let System = JSON.parse(localStorage.getItem("System"));
				if(System.CollapsedFieldset == undefined) {
					System.CollapsedFieldset = [0];
					localStorage.setItem("System", JSON.stringify(System));
				}
			}

		// KanaMaster
			// v4.00 (2025/01/08)
			// Optimize user data structure
			if(localStorage.KanaMaster_Highscore != undefined) {
				let Highscore = JSON.parse(localStorage.getItem("KanaMaster_Highscore"));
				if(Highscore[1].Sequence == undefined) {
					let NewObject = [
						0,
						{Sequence: Highscore[1][1], Date: Highscore[1][2], Score: Highscore[1][3], MaxCombo: Highscore[1][4], Accuracy: Highscore[1][5], AvgReactionTime: Highscore[1][6]},
						{Sequence: Highscore[2][1], Date: Highscore[2][2], Score: Highscore[2][3], MaxCombo: Highscore[2][4], Accuracy: Highscore[2][5], AvgReactionTime: Highscore[2][6]},
						{Sequence: Highscore[3][1], Date: Highscore[3][2], Score: Highscore[3][3], MaxCombo: Highscore[3][4], Accuracy: Highscore[3][5], AvgReactionTime: Highscore[3][6]},
						{Sequence: Highscore[4][1], Date: Highscore[4][2], Score: Highscore[4][3], MaxCombo: Highscore[4][4], Accuracy: Highscore[4][5], AvgReactionTime: Highscore[4][6]},
						{Sequence: Highscore[5][1], Date: Highscore[5][2], Score: Highscore[5][3], MaxCombo: Highscore[5][4], Accuracy: Highscore[5][5], AvgReactionTime: Highscore[5][6]},
						{Sequence: Highscore[6][1], Date: Highscore[6][2], Score: Highscore[6][3], MaxCombo: Highscore[6][4], Accuracy: Highscore[6][5], AvgReactionTime: Highscore[6][6]}
					];
					localStorage.setItem("KanaMaster_Highscore", JSON.stringify(NewObject));
				}
			}

			// v4.06 (2025/10/29)
			// Rename values (Game font)
			if(localStorage.KanaMaster_Subsystem != undefined) {
				let Subsystem = JSON.parse(localStorage.getItem("KanaMaster_Subsystem"));
				switch(Subsystem.Display.GameFont) {
					case "Default":
						Subsystem.Display.GameFont = "Inherit";
						localStorage.setItem("KanaMaster_Subsystem", JSON.stringify(Subsystem));
						break;
					case "Sans":
						Subsystem.Display.GameFont = "Sans-serif";
						localStorage.setItem("KanaMaster_Subsystem", JSON.stringify(Subsystem));
						break;
					default:
						break;
				}
			}

			// v5.00 (2025/11/12)
			// Change question range structure
			if(localStorage.KanaMaster_Game != undefined) {
				let Game = JSON.parse(localStorage.getItem("KanaMaster_Game"));
				if(Game.QuestionRange.length != 28) {
					Game.QuestionRange = [
						0,
						true, true, true, true, true, true, true, true, true, true,
						true, true, true, true, true, true, true, true, true, true,
						true,
						false, false,
						false, false,
						false, false
					];
					localStorage.setItem("KanaMaster_Game", JSON.stringify(Game));
				}
			}

		// Yamanobo-Ryou
			// v2.00 (2025/01/08), v2.02 (2025/01/09)
			// Optimize user data structure
			if(localStorage.YamanoboRyou_Game != undefined) {
				let Game = JSON.parse(localStorage.getItem("YamanoboRyou_Game"));
				if(Game.Terrain.Data[0].C == undefined) {
					let NewObject = [
						{C: "", A: 0}
					];
					for(let Looper = 1; Looper < Game.Terrain.Data.length; Looper++) {
						NewObject[Looper] = {
							C: Game.Terrain.Data[Looper][1],
							A: Game.Terrain.Data[Looper][2]
						}
					}
					Game.Terrain.Data = structuredClone(NewObject);
					localStorage.setItem("YamanoboRyou_Game", JSON.stringify(Game));
				}
				if(Game.Stats.Keystroke == undefined) {
					Game.Stats.Keystroke = {
						Count: Game.Stats.KeystrokeCount,
						Timestamp: Game.Stats.KeystrokeTimestamp
					};
					delete Game.Stats.KeystrokeCount;
					delete Game.Stats.KeystrokeTimestamp;
					localStorage.setItem("YamanoboRyou_Game", JSON.stringify(Game));
				}
			}
			if(localStorage.YamanoboRyou_Highscore != undefined) {
				let Highscore = JSON.parse(localStorage.getItem("YamanoboRyou_Highscore"));
				if(Highscore[1].Sequence == undefined) {
					let NewObject = [
						0,
						{Sequence: Highscore[1][1], Date: Highscore[1][2], Score: Highscore[1][3], AvgSpeed: Highscore[1][4], AvgKeystrokeSpeed: Highscore[1][5], Accuracy: Highscore[1][6]},
						{Sequence: Highscore[2][1], Date: Highscore[2][2], Score: Highscore[2][3], AvgSpeed: Highscore[2][4], AvgKeystrokeSpeed: Highscore[2][5], Accuracy: Highscore[2][6]},
						{Sequence: Highscore[3][1], Date: Highscore[3][2], Score: Highscore[3][3], AvgSpeed: Highscore[3][4], AvgKeystrokeSpeed: Highscore[3][5], Accuracy: Highscore[3][6]},
						{Sequence: Highscore[4][1], Date: Highscore[4][2], Score: Highscore[4][3], AvgSpeed: Highscore[4][4], AvgKeystrokeSpeed: Highscore[4][5], Accuracy: Highscore[4][6]},
						{Sequence: Highscore[5][1], Date: Highscore[5][2], Score: Highscore[5][3], AvgSpeed: Highscore[5][4], AvgKeystrokeSpeed: Highscore[5][5], Accuracy: Highscore[5][6]},
						{Sequence: Highscore[6][1], Date: Highscore[6][2], Score: Highscore[6][3], AvgSpeed: Highscore[6][4], AvgKeystrokeSpeed: Highscore[6][5], Accuracy: Highscore[6][6]}
					];
					localStorage.setItem("YamanoboRyou_Highscore", JSON.stringify(NewObject));
				}
			}

			// v3.00 (2025/12/14)
			// Rename values (Game font)
			if(localStorage.YamanoboRyou_Subsystem != undefined) {
				let Subsystem = JSON.parse(localStorage.getItem("YamanoboRyou_Subsystem"));
				switch(Subsystem.Display.GameFont) {
					case "Default":
					case "Iosevka, monospace":
						Subsystem.Display.GameFont = "Iosevka";
						localStorage.setItem("YamanoboRyou_Subsystem", JSON.stringify(Subsystem));
						break;
					case "Sans":
						Subsystem.Display.GameFont = "Sans-serif";
						localStorage.setItem("YamanoboRyou_Subsystem", JSON.stringify(Subsystem));
						break;
					case "Inter, sans-serif":
						Subsystem.Display.GameFont = "Inter";
						localStorage.setItem("YamanoboRyou_Subsystem", JSON.stringify(Subsystem));
						break;
					default:
						break;
				}
			}

		// GPS-PFD
			// v0.31 (2025/06/08) Beta Test
			// New feature
			if(localStorage.GPSPFD_PFD != undefined) {
				let PFD = JSON.parse(localStorage.getItem("GPSPFD_PFD"));
				if(PFD.Speed.TakeOff == undefined) {
					PFD.Speed.TakeOff = {
						V1: 72.016, VR: 74.588
					};
					PFD.Heading = {
						Mode: "GPS"
					};
					PFD.MCP = {
						Speed: {
							IsEnabled: false, Value: 0
						},
						Altitude: {
							IsEnabled: false, Value: 0
						},
						Heading: {
							IsEnabled: false, Value: 0
						}
					};
					localStorage.setItem("GPSPFD_PFD", JSON.stringify(PFD));
				}
			}

			// v0.35 (2025/07/17) Beta Test
			// New feature
			if(localStorage.GPSPFD_PFD != undefined) {
				let PFD = JSON.parse(localStorage.getItem("GPSPFD_PFD"));
				if(PFD.MCP.Speed.Mode == undefined) {
					PFD.MCP.Speed.Mode = "IAS";
					PFD.MCP.Speed.IAS = PFD.MCP.Speed.Value;
					PFD.MCP.Speed.MachNumber = 0;
					delete PFD.MCP.Speed.Value;
					localStorage.setItem("GPSPFD_PFD", JSON.stringify(PFD));
				}
			}

			// v0.41 (2025/08/12) Beta Test
			// New feature
			if(localStorage.GPSPFD_PFD != undefined) {
				let PFD = JSON.parse(localStorage.getItem("GPSPFD_PFD"));
				if(PFD.MCP.VerticalSpeed == undefined) {
					PFD.MCP.VerticalSpeed = {
						IsEnabled: false, Value: 0
					};
					localStorage.setItem("GPSPFD_PFD", JSON.stringify(PFD));
				}
			}

			// v0.46 (2025/10/01) Beta Test
			// New feature
			if(localStorage.GPSPFD_PFD != undefined) {
				let PFD = JSON.parse(localStorage.getItem("GPSPFD_PFD"));
				if(PFD.Altitude.SeatHeight == undefined) {
					PFD.Altitude.SeatHeight = 4.572;
					PFD.FlightMode.AutoSwitchFlightModeAndSwapAirports = true;
					delete PFD.FlightMode.AutoSwitchFlightModeAndSwapAirportData;
					PFD.WarningSystem = {
						IsEnabled: false
					};
					localStorage.setItem("GPSPFD_PFD", JSON.stringify(PFD));
				}
			}

			// v0.48 (2025/10/27) Beta Test
			// New feature
			if(localStorage.GPSPFD_Subsystem != undefined) {
				let Subsystem = JSON.parse(localStorage.getItem("GPSPFD_Subsystem"));
				if(Subsystem.I18n.MeasurementUnit == undefined) {
					Subsystem.I18n.MeasurementUnit = {
						Speed: "Knot", Distance: "NauticalMile", Altitude: "Foot", VerticalSpeed: "FeetPerMin",
						Temperature: "Celsius", Pressure: "Hectopascal", Weight: "Kilogram", Area: "SquareMeter"
					};
					localStorage.setItem("GPSPFD_Subsystem", JSON.stringify(Subsystem));
				}
			}
			if(localStorage.GPSPFD_PFD != undefined) {
				let PFD = JSON.parse(localStorage.getItem("GPSPFD_PFD"));
				if(PFD.Speed.Limit == undefined) {
					PFD.Speed.Limit = {
						Min: 61.728,
						Weight: 60000, WingArea: 125,
						MaxLiftCoefficient: {
							OnFlapsUp: 1.4, OnFlapsFull: 2.7
						},
						VMO: 174.896, VFE: 83.3328, MMO: 0.82
					};
					delete PFD.Speed.SpeedLimit;
					localStorage.setItem("GPSPFD_PFD", JSON.stringify(PFD));
				}
			}

			// v0.51 (2025/11/13) Beta Test
			// New runway feature, causing airport library structure overhaul
			if(localStorage.GPSPFD_PFD != undefined) {
				let PFD = JSON.parse(localStorage.getItem("GPSPFD_PFD"));
				if(PFD.Nav.AutoSwitchRunwayWhenLanding == undefined) {
					PFD.Nav.AutoSwitchRunwayWhenLanding = true;
					localStorage.setItem("GPSPFD_PFD", JSON.stringify(PFD));
				}
			}
			if(localStorage.GPSPFD_AirportLibrary != undefined) {
				let AirportLibrary = JSON.parse(localStorage.getItem("GPSPFD_AirportLibrary"));
				if(AirportLibrary.AirportSelection == undefined) {
					localStorage.removeItem("GPSPFD_AirportLibrary");
				}
			}

			// v0.55 (2025/11/25) Beta Test
			// New feature (Custom PFD font)
			if(localStorage.GPSPFD_Subsystem != undefined) {
				let Subsystem = JSON.parse(localStorage.getItem("GPSPFD_Subsystem"));
				if(Subsystem.Display.PFDFont == undefined) {
					Subsystem.Display.PFDFont = "Inherit";
					localStorage.setItem("GPSPFD_Subsystem", JSON.stringify(Subsystem));
				}
			}

			// v1.00 (2025/12/14)
			// Rename values (PFD style and PFD font)
			if(localStorage.GPSPFD_Subsystem != undefined) {
				let Subsystem = JSON.parse(localStorage.getItem("GPSPFD_Subsystem"));
				if(Subsystem.Display.PFDStyle == "Default") {
					Subsystem.Display.PFDStyle = "Normal";
					localStorage.setItem("GPSPFD_Subsystem", JSON.stringify(Subsystem));
				}
				switch(Subsystem.Display.PFDFont) {
					case "Inter, sans-serif":
						Subsystem.Display.PFDFont = "Inter";
						localStorage.setItem("GPSPFD_Subsystem", JSON.stringify(Subsystem));
						break;
					case "Century Gothic, sans-serif":
						Subsystem.Display.PFDFont = "Century Gothic";
						localStorage.setItem("GPSPFD_Subsystem", JSON.stringify(Subsystem));
						break;
					default:
						break;
				}
			}

			// v1.03 (2026/01/19)
			// New features
			if(localStorage.GPSPFD_Subsystem != undefined) {
				let Subsystem = JSON.parse(localStorage.getItem("GPSPFD_Subsystem"));
				if(Subsystem.Display.PFDStyle == "AutomobileSpeedometer") {
					Subsystem.Display.PFDStyle = "Normal";
					localStorage.setItem("GPSPFD_Subsystem", JSON.stringify(Subsystem));
				}
				if(Subsystem.Display.HideTopbarWhenNotScrolling == undefined) {
					Subsystem.Display.HideTopbarWhenNotScrolling = false;
					localStorage.setItem("GPSPFD_Subsystem", JSON.stringify(Subsystem));
				}
			}
			if(localStorage.GPSPFD_PFD != undefined) {
				let PFD = JSON.parse(localStorage.getItem("GPSPFD_PFD"));
				if(PFD.Attitude.Sensitivity == undefined) {
					PFD.Attitude.Sensitivity = 5;
					localStorage.setItem("GPSPFD_PFD", JSON.stringify(PFD));
				}
			}

			// v2.00 (2026/01/28)
			// Rename values and remove useless features
			if(localStorage.GPSPFD_PFD != undefined) {
				let PFD = JSON.parse(localStorage.getItem("GPSPFD_PFD"));
				if(PFD.Attitude.Mode == "Accel") {
					PFD.Attitude.Mode = "Sensor";
					localStorage.setItem("GPSPFD_PFD", JSON.stringify(PFD));
				}
				if(PFD.Speed.Mode == "Accel" || PFD.Speed.Mode == "DualChannel") {
					PFD.Speed.Mode = "GPS";
					localStorage.setItem("GPSPFD_PFD", JSON.stringify(PFD));
				}
				if(PFD.Altitude.Mode == "Accel" || PFD.Altitude.Mode == "DualChannel") {
					PFD.Altitude.Mode = "GPS";
					localStorage.setItem("GPSPFD_PFD", JSON.stringify(PFD));
				}
			}
	}
