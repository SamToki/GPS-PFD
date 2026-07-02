// For SamToki.github.io/GPS-PFD
// Released under GNU GPL v3 open source license.
// © 2025 SAM TOKI STUDIO

// Initialization
	// Declare variables
	"use strict";

	// Repair user data: Solves incompatibility after version updates. A repairer may get removed if older than 24 months.
	function RepairUserData() {
		// System
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
