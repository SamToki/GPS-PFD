// For SamToki.github.io/GPS-PFD
// Released under GNU GPL v3 open source license.
// © 2025 SAM TOKI STUDIO

// Initialization
	// Declare variables
	"use strict";

// Refresh
	// PFD
		// Sub-functions
			// Sub-functions
			function RefreshAutomobileSpeedometerPanel() {
				// Initialization
				Fade("Ctnr_PFDAutomobileSpeedometerPanelInfo");
				RemoveClass("Ctnr_PFDAutomobileSpeedometerPanelInfo", "RedText");
				RemoveClass("Ctnr_PFDAutomobileSpeedometerPanelInfo", "OrangeText");

				// Status
				RemoveClass("Ctrl_PFDAutomobileSpeedometerPanelGPS", "Red");
				RemoveClass("Ctrl_PFDAutomobileSpeedometerPanelGPS", "Orange");
				RemoveClass("Ctrl_PFDAutomobileSpeedometerPanelGPS", "Green");
				RemoveClass("Ctrl_PFDAutomobileSpeedometerPanelAccel", "Red");
				RemoveClass("Ctrl_PFDAutomobileSpeedometerPanelAccel", "Green");
				if(PFD0.Status.GPS.PermissionStatus != "Denied") {
					if(PFD0.Status.GPS.IsPositionAvailable == true) {
						if(PFD0.Status.GPS.IsPositionAccurate == true && PFD0.Status.GPS.IsAltitudeAvailable == true && PFD0.Status.GPS.IsAltitudeAccurate == true) {
							AddClass("Ctrl_PFDAutomobileSpeedometerPanelGPS", "Green");
						} else {
							AddClass("Ctrl_PFDAutomobileSpeedometerPanelGPS", "Orange");
						}
					}
				} else {
					AddClass("Ctrl_PFDAutomobileSpeedometerPanelGPS", "Red");
				}
				if(PFD0.Status.Accel.PermissionStatus != "Denied") {
					if(PFD0.Status.Accel.IsAvailable == true) {
						AddClass("Ctrl_PFDAutomobileSpeedometerPanelAccel", "Green");
					}
				} else {
					AddClass("Ctrl_PFDAutomobileSpeedometerPanelAccel", "Red");
				}

				// Speed
				if((PFD.Speed.Mode == "GPS" && PFD0.Status.GPS.IsSpeedAvailable == true) ||
				(PFD.Speed.Mode == "Accel" && PFD0.Status.Accel.IsAvailable == true) ||
				(PFD.Speed.Mode == "DualChannel" && (PFD0.Status.GPS.IsSpeedAvailable == true || PFD0.Status.Accel.IsAvailable == true)) ||
				PFD.Speed.Mode == "Manual") {
					// Show ctrls
					RemoveClass("Ctnr_PFDAutomobileSpeedometerPanelSpeed", "Transparent");
					if(System.Display.Anim > 0) {
						ChangeAnim("Ctrl_PFDAutomobileSpeedometerPanelNeedle", "100ms");
						ChangeAnim("Ctrl_PFDAutomobileSpeedometerPanelAdditionalIndicators", "100ms");
					} else {
						ChangeAnim("Ctrl_PFDAutomobileSpeedometerPanelNeedle", "");
						ChangeAnim("Ctrl_PFDAutomobileSpeedometerPanelAdditionalIndicators", "");
					}

					// Needle
					if(ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) <= 125) {
						ChangeRotate("Needle_PFDAutomobileSpeedometerPanel", -120 + ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) * 2);
					} else {
						ChangeRotate("Needle_PFDAutomobileSpeedometerPanel", 130);
					}

					// Additional indicators
						// Speed limits
						switch(PFD.FlightMode.FlightMode) {
							case "DepartureGround":
							case "ArrivalGround":
								ChangeProgring("ProgringFg_PFDAutomobileSpeedometerPanelSpeedLimitMin", 400, 0);
								break;
							case "TakeOff":
							case "Cruise":
							case "Land":
							case "EmergencyReturn":
								if(ConvertUnit(PFD0.Stats.Speed.Limit.Min, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) <= 120) {
									ChangeProgring("ProgringFg_PFDAutomobileSpeedometerPanelSpeedLimitMin", 400, ConvertUnit(PFD0.Stats.Speed.Limit.Min, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) * 2 / 360 * 100);
								} else {
									ChangeProgring("ProgringFg_PFDAutomobileSpeedometerPanelSpeedLimitMin", 400, 240 / 360 * 100);
								}
								break;
							default:
								AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshPFDPanel is invalid.");
								break;
						}
						if(ConvertUnit(PFD0.Stats.Speed.Limit.Max, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) <= 120) {
							document.getElementById("ProgringFg_PFDAutomobileSpeedometerPanelSpeedLimitMax").style.strokeDasharray = "0, " +
								(Math.PI * 395) * (1 - (120 - ConvertUnit(PFD0.Stats.Speed.Limit.Max, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed)) * 2 / 360) + "px, " +
								(Math.PI * 395) * ((120 - ConvertUnit(PFD0.Stats.Speed.Limit.Max, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed)) * 2 / 360) + "px";
						} else {
							document.getElementById("ProgringFg_PFDAutomobileSpeedometerPanelSpeedLimitMax").style.strokeDasharray = "0, " + (Math.PI * 395) + "px";
						}

						// Avg IAS
						if(ConvertUnit(PFD0.Stats.Speed.AvgIASDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) <= 120) {
							ChangeRotate("Ctrl_PFDAutomobileSpeedometerPanelAvgIAS", -120 + ConvertUnit(PFD0.Stats.Speed.AvgIASDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) * 2);
						} else {
							ChangeRotate("Ctrl_PFDAutomobileSpeedometerPanelAvgIAS", 120);
						}

						// MCP
						if(PFD.MCP.Speed.IsEnabled == true) {
							Show("Ctrl_PFDAutomobileSpeedometerPanelMCPSpeedCircle");
							if(ConvertUnit(PFD.MCP.Speed.IAS, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) <= 120) {
								ChangeRotate("Ctrl_PFDAutomobileSpeedometerPanelMCPSpeedCircle", -120 + ConvertUnit(PFD.MCP.Speed.IAS, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) * 2);
							} else {
								ChangeRotate("Ctrl_PFDAutomobileSpeedometerPanelMCPSpeedCircle", 120);
							}
						} else {
							Fade("Ctrl_PFDAutomobileSpeedometerPanelMCPSpeedCircle");
						}

					// Drum
					ChangeTop("RollingDigit_PFDAutomobileSpeedometerPanel1", -45 * (9 - PFD0.Stats.Speed.BalloonDisplay[1]) + "px");
					ChangeTop("RollingDigit_PFDAutomobileSpeedometerPanel2", -45 * (10 - PFD0.Stats.Speed.BalloonDisplay[2]) + "px");
					switch(true) {
						case ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) < 1:
							ChangeTop("RollingDigit_PFDAutomobileSpeedometerPanel3", 15 - 30 * (18 - PFD0.Stats.Speed.BalloonDisplay[3]) + "px");
							break;
						case ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) > 998:
							ChangeTop("RollingDigit_PFDAutomobileSpeedometerPanel3", 15 - 30 * (9 - PFD0.Stats.Speed.BalloonDisplay[3]) + "px");
							break;
						default:
							ChangeTop("RollingDigit_PFDAutomobileSpeedometerPanel3", 15 - 30 * (14 - PFD0.Stats.Speed.BalloonDisplay[3]) + "px");
							break;
					}

					// Warning
					if(PFD0.Alert.Active.SpeedWarning != "") {
						AddClass("Ctrl_PFDAutomobileSpeedometerPanelDrum", "RedText");
						Show("Ctnr_PFDAutomobileSpeedometerPanelInfo");
						AddClass("Ctnr_PFDAutomobileSpeedometerPanelInfo", "RedText");
						ChangeText("Label_PFDAutomobileSpeedometerPanelInfo", Translate(PFD0.Alert.Active.SpeedWarning));
					} else {
						RemoveClass("Ctrl_PFDAutomobileSpeedometerPanelDrum", "RedText");
					}
				} else {
					AddClass("Ctnr_PFDAutomobileSpeedometerPanelSpeed", "Transparent");
					Show("Ctnr_PFDAutomobileSpeedometerPanelInfo");
					AddClass("Ctnr_PFDAutomobileSpeedometerPanelInfo", "OrangeText");
					ChangeText("Label_PFDAutomobileSpeedometerPanelInfo", Translate("SpeedUnavailable"));
				}

				// Speed trend
				for(let Looper = 1; Looper <= 3; Looper++) {
					RemoveClass("Ctrl_PFDAutomobileSpeedometerPanelSpeedTrend" + Looper, "Green");
					RemoveClass("Ctrl_PFDAutomobileSpeedometerPanelSpeedTrend" + (Looper + 3), "Red");
				}
				if(ConvertUnit(PFD0.Stats.Speed.TrendDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) >= 3) {
					AddClass("Ctrl_PFDAutomobileSpeedometerPanelSpeedTrend3", "Green");
				}
				if(ConvertUnit(PFD0.Stats.Speed.TrendDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) >= 15) {
					AddClass("Ctrl_PFDAutomobileSpeedometerPanelSpeedTrend2", "Green");
				}
				if(ConvertUnit(PFD0.Stats.Speed.TrendDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) >= 30) {
					AddClass("Ctrl_PFDAutomobileSpeedometerPanelSpeedTrend1", "Green");
				}
				if(ConvertUnit(PFD0.Stats.Speed.TrendDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) <= -3) {
					AddClass("Ctrl_PFDAutomobileSpeedometerPanelSpeedTrend4", "Red");
				}
				if(ConvertUnit(PFD0.Stats.Speed.TrendDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) <= -15) {
					AddClass("Ctrl_PFDAutomobileSpeedometerPanelSpeedTrend5", "Red");
				}
				if(ConvertUnit(PFD0.Stats.Speed.TrendDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) <= -30) {
					AddClass("Ctrl_PFDAutomobileSpeedometerPanelSpeedTrend6", "Red");
				}

				// DME
				if(PFD.Nav.IsEnabled == true && PFD0.Status.GPS.IsPositionAvailable == true) {
					Show("Ctnr_PFDAutomobileSpeedometerPanelDME");
					if(PFD0.Stats.Nav.Distance < 10000000) { // Max 10000 kilometers.
						ChangeText("Label_PFDAutomobileSpeedometerPanelDMEDistance",
							ConvertUnit(PFD0.Stats.Nav.Distance, "Meter", Subsystem.I18n.MeasurementUnit.Distance).toFixed(1) + "<span class=\"SmallerText\">" + Translate(Subsystem.I18n.MeasurementUnit.Distance + "OnPFD") + "</span>");
						if(PFD0.Stats.Speed.GSDisplay > 0 && PFD0.Stats.Nav.ETA < 360000000) { // Max 100 hours.
							ChangeText("Label_PFDAutomobileSpeedometerPanelDMEETA",
								Math.trunc(PFD0.Stats.Nav.ETA / 3600000) + "<span class=\"SmallerText\">" + Translate("Hour") + "</span>" +
								Math.trunc(PFD0.Stats.Nav.ETA % 3600000 / 60000).toString().padStart(2, "0") + "<span class=\"SmallerText\">" + Translate("Minute") + "</span>");
						} else {
							ChangeText("Label_PFDAutomobileSpeedometerPanelDMEETA", "--<span class=\"SmallerText\">" + Translate("Hour") + "</span>--<span class=\"SmallerText\">" + Translate("Minute") + "</span>");
						}
					} else {
						ChangeText("Label_PFDAutomobileSpeedometerPanelDMEDistance", Translate("DistanceTooFar"));
						ChangeText("Label_PFDAutomobileSpeedometerPanelDMEETA", "--<span class=\"SmallerText\">" + Translate("Hour") + "</span>--<span class=\"SmallerText\">" + Translate("Minute") + "</span>");
					}
				} else {
					Fade("Ctnr_PFDAutomobileSpeedometerPanelDME");
				}

				// Altitude
				if((PFD.Altitude.Mode == "GPS" && PFD0.Status.GPS.IsAltitudeAvailable == true) ||
				(PFD.Altitude.Mode == "Accel" && PFD0.Status.Accel.IsAvailable == true) ||
				(PFD.Altitude.Mode == "DualChannel" && (PFD0.Status.GPS.IsAltitudeAvailable == true || PFD0.Status.Accel.IsAvailable == true)) ||
				PFD.Altitude.Mode == "Manual") {
					Show("Ctnr_PFDAutomobileSpeedometerPanelAltitude");
					ChangeText("Label_PFDAutomobileSpeedometerPanelAltitudeValue",
						ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude).toFixed(0) + "<span class=\"SmallerText\">" + Translate(Subsystem.I18n.MeasurementUnit.Altitude + "OnPFD") + "</span>");
				} else {
					Fade("Ctnr_PFDAutomobileSpeedometerPanelAltitude");
				}
			}
