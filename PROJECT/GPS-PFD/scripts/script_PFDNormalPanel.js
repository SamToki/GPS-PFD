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
			function RefreshNormalPanel() {
				// Info bar
				if(PFD0.Status.GPS.PermissionStatus != "Denied") {
					if(PFD0.Status.GPS.IsPositionAvailable == true) {
						RemoveClass("Ctrl_PFDNormalPanelGPS", "OrangeText");
						if(PFD0.Status.GPS.IsPositionAccurate == true && PFD0.Status.GPS.IsAltitudeAvailable == true && PFD0.Status.GPS.IsAltitudeAccurate == true) {
							ChangeText("Label_PFDNormalPanelGPSValue", Translate("Normal"));
						} else {
							ChangeText("Label_PFDNormalPanelGPSValue", Translate("SignalWeak"));
						}
					} else {
						AddClass("Ctrl_PFDNormalPanelGPS", "OrangeText");
						ChangeText("Label_PFDNormalPanelGPSValue", Translate("Unavailable"));
					}
				} else {
					AddClass("Ctrl_PFDNormalPanelGPS", "OrangeText");
					ChangeText("Label_PFDNormalPanelGPSValue", Translate("Denied"));
				}
				if(PFD0.Status.Accel.PermissionStatus != "Denied") {
					if(PFD0.Status.Accel.IsAvailable == true) {
						RemoveClass("Ctrl_PFDNormalPanelAccel", "OrangeText");
						ChangeText("Label_PFDNormalPanelAccelValue", Translate("Normal"));
					} else {
						AddClass("Ctrl_PFDNormalPanelAccel", "OrangeText");
						ChangeText("Label_PFDNormalPanelAccelValue", Translate("Unavailable"));
					}
				} else {
					AddClass("Ctrl_PFDNormalPanelAccel", "OrangeText");
					ChangeText("Label_PFDNormalPanelAccelValue", Translate("Denied"));
				}
				if((PFD.Speed.Mode == "GPS" && PFD0.Status.GPS.IsSpeedAvailable == true) ||
				(PFD.Speed.Mode == "Accel" && PFD0.Status.Accel.IsAvailable == true) ||
				(PFD.Speed.Mode == "DualChannel" && (PFD0.Status.GPS.IsSpeedAvailable == true || PFD0.Status.Accel.IsAvailable == true)) ||
				PFD.Speed.Mode == "Manual") {
					ChangeText("Label_PFDNormalPanelGSValue", ConvertUnit(PFD0.Stats.Speed.GSDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed).toFixed(0) + "<span class=\"SmallerText\">" + Translate(Subsystem.I18n.MeasurementUnit.Speed + "OnPFD") + "</span>");
					ChangeText("Label_PFDNormalPanelAvgGSValue", ConvertUnit(PFD0.Stats.Speed.AvgGSDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed).toFixed(0) + "<span class=\"SmallerText\">" + Translate(Subsystem.I18n.MeasurementUnit.Speed + "OnPFD") + "</span>");
					ChangeText("Label_PFDNormalPanelTASValue", ConvertUnit(PFD0.Stats.Speed.TASDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed).toFixed(0) + "<span class=\"SmallerText\">" + Translate(Subsystem.I18n.MeasurementUnit.Speed + "OnPFD") + "</span>");
				} else {
					ChangeText("Label_PFDNormalPanelGSValue", "---");
					ChangeText("Label_PFDNormalPanelAvgGSValue", "---");
					ChangeText("Label_PFDNormalPanelTASValue", "---");
				}
				if(PFD.Speed.Wind.Speed > 0) {
					ChangeText("Label_PFDNormalPanelWindValue", PFD.Speed.Wind.Direction.toString().padStart(3, "0") + "°/" + ConvertUnit(PFD.Speed.Wind.Speed, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed).toFixed(0));
					if((PFD.Heading.Mode == "GPS" && PFD0.Status.GPS.IsHeadingAvailable == true) ||
					PFD.Heading.Mode == "Manual") {
						Show("PFDNormalPanelWindDirection");
						ChangeRotate("Needle_PFDNormalPanelWindDirection", PFD0.Stats.Speed.Wind.RelativeHeading);
					} else {
						Fade("PFDNormalPanelWindDirection");
					}
				} else {
					ChangeText("Label_PFDNormalPanelWindValue", Translate("NoWind"));
					Fade("PFDNormalPanelWindDirection");
				}
				if(PFD.Flaps > 0) {
					ChangeText("Label_PFDNormalPanelFlapsValue", PFD.Flaps + "%");
				} else {
					ChangeText("Label_PFDNormalPanelFlapsValue", Translate("FlapsUp"));
				}
				ChangeProgbar("ProgbarFg_PFDNormalPanelFlaps", "Vertical", PFD.Flaps);

				// FMA
				ChangeText("Label_PFDNormalPanelSpeedModeValue", Translate(PFD.Speed.Mode));
				ChangeText("Label_PFDNormalPanelAltitudeModeValue", Translate(PFD.Altitude.Mode));
				ChangeText("Label_PFDNormalPanelHeadingModeValue", Translate(PFD.Heading.Mode));
				ChangeText("Label_PFDNormalPanelFlightMode", Translate(PFD.FlightMode.FlightMode));
				if(PFD0.Stats.ClockTime - PFD0.Stats.FlightModeTimestamp < 10000) {
					AddClass("Ctnr_PFDNormalPanelFMA2", "Reminder");
				} else {
					RemoveClass("Ctnr_PFDNormalPanelFMA2", "Reminder");
				}

				// Attitude
				Fade("Ctrl_PFDNormalPanelAttitudeStatus");
				Fade("Ctrl_PFDNormalPanelAttitudeBg");
				Fade("Ctrl_PFDNormalPanelAttitudePitch");
				Fade("Ctrl_PFDNormalPanelAttitudeRoll");
				Fade("Ctrl_PFDNormalPanelAttitudeAircraftSymbol");
				if(PFD.Attitude.IsEnabled == true) {
					if((PFD.Attitude.Mode == "Accel" && PFD0.Status.Accel.IsAvailable == true) ||
					PFD.Attitude.Mode == "Manual") {
						Show("Ctrl_PFDNormalPanelAttitudeBg");
						Show("Ctrl_PFDNormalPanelAttitudePitch");
						Show("Ctrl_PFDNormalPanelAttitudeRoll");
						Show("Ctrl_PFDNormalPanelAttitudeAircraftSymbol");
						if(System.Display.Anim > 0) {
							ChangeAnim("Ctrl_PFDNormalPanelAttitudeBg", "100ms");
							ChangeAnim("Ctrl_PFDNormalPanelAttitudePitch", "100ms");
							ChangeAnim("Ctrl_PFDNormalPanelAttitudeRoll", "100ms");
						} else {
							ChangeAnim("Ctrl_PFDNormalPanelAttitudeBg", "");
							ChangeAnim("Ctrl_PFDNormalPanelAttitudePitch", "");
							ChangeAnim("Ctrl_PFDNormalPanelAttitudeRoll", "");
						}
						ChangeTop("Ctrl_PFDNormalPanelAttitudeBg", "calc(50% - 2000px + " + 10 * PFD0.Stats.Attitude.PitchDisplay2 * Math.cos(DegToRad(Math.abs(PFD0.Stats.Attitude.RollDisplay))) + "px)");
						ChangeLeft("Ctrl_PFDNormalPanelAttitudeBg", "calc(50% - 2000px + " + 10 * PFD0.Stats.Attitude.PitchDisplay2 * Math.sin(DegToRad(PFD0.Stats.Attitude.RollDisplay)) + "px)");
						ChangeRotate("Ctrl_PFDNormalPanelAttitudeBg", -PFD0.Stats.Attitude.RollDisplay);
						ChangeTop("CtrlGroup_PFDNormalPanelAttitudePitch", "calc(50% - 900px + " + 10 * PFD0.Stats.Attitude.PitchDisplay + "px)");
						ChangeRotate("Ctrl_PFDNormalPanelAttitudePitch", -PFD0.Stats.Attitude.RollDisplay);
						ChangeRotate("CtrlGroup_PFDNormalPanelAttitudeRollScale", -PFD0.Stats.Attitude.RollDisplay);
						if(PFD0.Stats.Attitude.RollDisplay <= 0) {
							document.getElementById("ProgringFg_PFDNormalPanelAttitudeRoll").style.strokeDasharray = (Math.PI * 420) * (-PFD0.Stats.Attitude.RollDisplay / 360) + "px, " + (Math.PI * 420) * (1 + PFD0.Stats.Attitude.RollDisplay / 360) + "px";
						} else {
							document.getElementById("ProgringFg_PFDNormalPanelAttitudeRoll").style.strokeDasharray = "0, " + (Math.PI * 420) * (1 - PFD0.Stats.Attitude.RollDisplay / 360) + "px, " + (Math.PI * 420) * (PFD0.Stats.Attitude.RollDisplay / 360) + "px";
						}
						if(PFD0.Alert.Active.AttitudeWarning == "BankAngle") {
							AddClass("ProgringFg_PFDNormalPanelAttitudeRoll", "BankAngleWarning");
							AddClass("PFDNormalPanelAttitudeRollPointer", "BankAngleWarning");
						} else {
							RemoveClass("ProgringFg_PFDNormalPanelAttitudeRoll", "BankAngleWarning");
							RemoveClass("PFDNormalPanelAttitudeRollPointer", "BankAngleWarning");
						}
					} else {
						Show("Ctrl_PFDNormalPanelAttitudeStatus");
						AddClass("Ctrl_PFDNormalPanelAttitudeStatus", "OrangeText");
						ChangeText("Label_PFDNormalPanelAttitudeStatus", Translate("AttitudeUnavailable"));
					}
				} else {
					Show("Ctrl_PFDNormalPanelAttitudeStatus");
					RemoveClass("Ctrl_PFDNormalPanelAttitudeStatus", "OrangeText");
					ChangeText("Label_PFDNormalPanelAttitudeStatus", Translate("AttitudeDisabled"));
				}

				// Speed
				Fade("Ctrl_PFDNormalPanelSpeedStatus");
				Fade("Ctrl_PFDNormalPanelSpeedTape");
				Fade("Ctrl_PFDNormalPanelSpeedAdditionalIndicators");
				Fade("Ctrl_PFDNormalPanelSpeedBalloon");
				Fade("Ctrl_PFDNormalPanelMCPSpeed");
				Fade("Ctrl_PFDNormalPanelMachNumber");
				if((PFD.Speed.Mode == "GPS" && PFD0.Status.GPS.IsSpeedAvailable == true) ||
				(PFD.Speed.Mode == "Accel" && PFD0.Status.Accel.IsAvailable == true) ||
				(PFD.Speed.Mode == "DualChannel" && (PFD0.Status.GPS.IsSpeedAvailable == true || PFD0.Status.Accel.IsAvailable == true)) ||
				PFD.Speed.Mode == "Manual") {
					// Show ctrls
					Show("Ctrl_PFDNormalPanelSpeedTape");
					Show("Ctrl_PFDNormalPanelSpeedAdditionalIndicators");
					Show("Ctrl_PFDNormalPanelSpeedBalloon");
					if(System.Display.Anim > 0) {
						ChangeAnim("Ctrl_PFDNormalPanelSpeedTape", "100ms");
						ChangeAnim("Ctrl_PFDNormalPanelSpeedAdditionalIndicators", "100ms");
					} else {
						ChangeAnim("Ctrl_PFDNormalPanelSpeedTape", "");
						ChangeAnim("Ctrl_PFDNormalPanelSpeedAdditionalIndicators", "");
					}

					// Tape
					ChangeTop("CtrlGroup_PFDNormalPanelSpeedTape", "calc(50% - 5000px + " + 5 * ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) + "px)");

					// Additional indicators
						// Speed trend
						if(Math.abs(ConvertUnit(PFD0.Stats.Speed.TrendDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed)) >= 3) {
							Show("Needle_PFDNormalPanelSpeedTrend");
						} else {
							Fade("Needle_PFDNormalPanelSpeedTrend");
						}
						ChangeTop("Needle_PFDNormalPanelSpeedTrend", "calc(50% - " + 5 * Math.abs(ConvertUnit(PFD0.Stats.Speed.TrendDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed)) + "px)");
						ChangeHeight("Needle_PFDNormalPanelSpeedTrend", 10 * Math.abs(ConvertUnit(PFD0.Stats.Speed.TrendDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed)) + "px");
						if(PFD0.Stats.Speed.TrendDisplay >= 0) {
							RemoveClass("Needle_PFDNormalPanelSpeedTrend", "Decreasing");
						} else {
							AddClass("Needle_PFDNormalPanelSpeedTrend", "Decreasing");
						}

						// Other speeds
						ChangeTop("CtrlGroup_PFDNormalPanelOtherSpeeds", "calc(50% - 5000px + " + 5 * ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) + "px)");
							// Speed limits
							switch(PFD.FlightMode.FlightMode) {
								case "DepartureGround":
								case "ArrivalGround":
									Hide("Ctrl_PFDNormalPanelSpeedLimitMin");
									break;
								case "TakeOff":
								case "Cruise":
								case "Land":
								case "EmergencyReturn":
									Show("Ctrl_PFDNormalPanelSpeedLimitMin");
									ChangeHeight("Ctrl_PFDNormalPanelSpeedLimitMin", 5 * ConvertUnit(PFD0.Stats.Speed.Limit.Min, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) + "px");
									break;
								default:
									AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshNormalPanel is invalid.");
									break;
							}
							ChangeHeight("Ctrl_PFDNormalPanelSpeedLimitMax", 5 * (1000 - ConvertUnit(PFD0.Stats.Speed.Limit.Max, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed)) + "px");

							// Avg IAS
							ChangeBottom("Ctrl_PFDNormalPanelAvgIAS", 5 * ConvertUnit(PFD0.Stats.Speed.AvgIASDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) - 10 + "px");

							// MCP
							if(PFD.MCP.Speed.IsEnabled == true) {
								Show("Ctrl_PFDNormalPanelMCPSpeedCircle");
								ChangeBottom("Ctrl_PFDNormalPanelMCPSpeedCircle", 5 * ConvertUnit(PFD.MCP.Speed.IAS, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) - 10 + "px");
							} else {
								Fade("Ctrl_PFDNormalPanelMCPSpeedCircle");
							}

							// Take off
							switch(PFD.FlightMode.FlightMode) {
								case "DepartureGround":
									Show("Ctrl_PFDNormalPanelV1");
									Show("Ctrl_PFDNormalPanelVR");
									ChangeBottom("Ctrl_PFDNormalPanelV1", 5 * ConvertUnit(PFD.Speed.TakeOff.V1, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) + "px");
									ChangeBottom("Ctrl_PFDNormalPanelVR", 5 * ConvertUnit(PFD.Speed.TakeOff.VR, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) + "px");
									break;
								case "TakeOff":
								case "Cruise":
								case "Land":
								case "ArrivalGround":
								case "EmergencyReturn":
									Fade("Ctrl_PFDNormalPanelV1");
									Fade("Ctrl_PFDNormalPanelVR");
									break;
								default:
									AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshNormalPanel is invalid.");
									break;
							}

					// Balloon
					ChangeTop("RollingDigit_PFDNormalPanelSpeed1", -45 * (9 - PFD0.Stats.Speed.BalloonDisplay[1]) + "px");
					ChangeTop("RollingDigit_PFDNormalPanelSpeed2", -45 * (10 - PFD0.Stats.Speed.BalloonDisplay[2]) + "px");
					switch(true) {
						case ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) < 1:
							ChangeTop("RollingDigit_PFDNormalPanelSpeed3", 15 - 30 * (18 - PFD0.Stats.Speed.BalloonDisplay[3]) + "px");
							break;
						case ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) > 998:
							ChangeTop("RollingDigit_PFDNormalPanelSpeed3", 15 - 30 * (9 - PFD0.Stats.Speed.BalloonDisplay[3]) + "px");
							break;
						default:
							ChangeTop("RollingDigit_PFDNormalPanelSpeed3", 15 - 30 * (14 - PFD0.Stats.Speed.BalloonDisplay[3]) + "px");
							break;
					}
					if(PFD0.Alert.Active.SpeedWarning != "") {
						AddClass("Ctrl_PFDNormalPanelSpeedBalloonBalloon", "Warning");
					} else {
						RemoveClass("Ctrl_PFDNormalPanelSpeedBalloonBalloon", "Warning");
					}

					// MCP
					if(PFD.MCP.Speed.IsEnabled == true) {
						Show("Ctrl_PFDNormalPanelMCPSpeed");
						switch(PFD.MCP.Speed.Mode) {
							case "IAS":
								ChangeText("Label_PFDNormalPanelMCPSpeed", ConvertUnit(PFD.MCP.Speed.IAS, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed).toFixed(0));
								break;
							case "MachNumber":
								ChangeText("Label_PFDNormalPanelMCPSpeed", PFD.MCP.Speed.MachNumber.toFixed(3).replace("0.", "."));
								break;
							default:
								AlertSystemError("The value of PFD.MCP.Speed.Mode \"" + PFD.MCP.Speed.Mode + "\" in function RefreshNormalPanel is invalid.");
								break;
						}
					}

					// Mach number
					if(PFD0.Stats.Speed.MachNumber >= 0.5) {
						Show("Ctrl_PFDNormalPanelMachNumber");
						ChangeText("Label_PFDNormalPanelMachNumber", PFD0.Stats.Speed.MachNumber.toFixed(3).replace("0.", "."));
					}
				} else {
					Show("Ctrl_PFDNormalPanelSpeedStatus");
					ChangeText("Label_PFDNormalPanelSpeedStatus", Translate("SpeedUnavailable"));
				}

				// Altitude
				Fade("Ctrl_PFDNormalPanelAltitudeStatus");
				Fade("Ctrl_PFDNormalPanelAltitudeTape");
				Fade("Ctrl_PFDNormalPanelAltitudeAdditionalIndicators");
				Fade("Ctrl_PFDNormalPanelAltitudeBalloon");
				Fade("Ctrl_PFDNormalPanelMCPAltitude");
				Fade("Ctrl_PFDNormalPanelMetricAltitude");
				if((PFD.Altitude.Mode == "GPS" && PFD0.Status.GPS.IsAltitudeAvailable == true) ||
				(PFD.Altitude.Mode == "Accel" && PFD0.Status.Accel.IsAvailable == true) ||
				(PFD.Altitude.Mode == "DualChannel" && (PFD0.Status.GPS.IsAltitudeAvailable == true || PFD0.Status.Accel.IsAvailable == true)) ||
				PFD.Altitude.Mode == "Manual") {
					// Show ctrls
					Show("Ctrl_PFDNormalPanelAltitudeTape");
					Show("Ctrl_PFDNormalPanelAltitudeAdditionalIndicators");
					Show("Ctrl_PFDNormalPanelAltitudeBalloon");
					if(System.Display.Anim > 0) {
						ChangeAnim("Ctrl_PFDNormalPanelAltitudeTape", "100ms");
						ChangeAnim("Ctrl_PFDNormalPanelAltitudeAdditionalIndicators", "100ms");
					} else {
						ChangeAnim("Ctrl_PFDNormalPanelAltitudeTape", "");
						ChangeAnim("Ctrl_PFDNormalPanelAltitudeAdditionalIndicators", "");
					}

					// Tape
					ChangeTop("CtrlGroup_PFDNormalPanelAltitudeTape", "calc(50% - 37500px + " + 0.75 * ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) + "px)");

					// Additional indicators
						// Altitude trend
						if(Math.abs(ConvertUnit(PFD0.Stats.Altitude.TrendDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude)) >= 20) {
							Show("Needle_PFDNormalPanelAltitudeTrend");
						} else {
							Fade("Needle_PFDNormalPanelAltitudeTrend");
						}
						ChangeTop("Needle_PFDNormalPanelAltitudeTrend", "calc(50% - " + 0.75 * Math.abs(ConvertUnit(PFD0.Stats.Altitude.TrendDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude)) + "px)");
						ChangeHeight("Needle_PFDNormalPanelAltitudeTrend", 1.5 * Math.abs(ConvertUnit(PFD0.Stats.Altitude.TrendDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude)) + "px");
						if(PFD0.Stats.Altitude.TrendDisplay >= 0) {
							RemoveClass("Needle_PFDNormalPanelAltitudeTrend", "Decreasing");
						} else {
							AddClass("Needle_PFDNormalPanelAltitudeTrend", "Decreasing");
						}

						// Other altitudes
						ChangeTop("CtrlGroup_PFDNormalPanelOtherAltitudes", "calc(50% - 37500px + " + 0.75 * ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) + "px)");
							// Ground altitude
							ChangeBottom("Ctrl_PFDNormalPanelGroundAltitude", 0.75 * (ConvertUnit(PFD0.Stats.Altitude.Ground, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) + 2000) - 40 + "px");

							// Decision altitude
							switch(PFD.FlightMode.FlightMode) {
								case "DepartureGround":
								case "TakeOff":
								case "Cruise":
									Fade("Ctrl_PFDNormalPanelDecisionAltitude");
									break;
								case "Land":
								case "ArrivalGround":
								case "EmergencyReturn":
									Show("Ctrl_PFDNormalPanelDecisionAltitude");
									ChangeBottom("Ctrl_PFDNormalPanelDecisionAltitude", 0.75 * (ConvertUnit(PFD0.Stats.Altitude.Ground + AirportLibrary0.ActiveAirport.Runway[AirportLibrary0.ActiveAirport.RunwaySelection].DecisionHeight, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) + 2000) - 10 + "px");
									if(PFD0.Status.IsDecisionAltitudeActive == true) {
										AddClass("Ctrl_PFDNormalPanelDecisionAltitude", "Active");
									} else {
										RemoveClass("Ctrl_PFDNormalPanelDecisionAltitude", "Active");
									}
									break;
								default:
									AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshNormalPanel is invalid.");
									break;
							}

							// MCP
							if(PFD.MCP.Altitude.IsEnabled == true) {
								Show("Ctrl_PFDNormalPanelMCPAltitudeCircle");
								ChangeBottom("Ctrl_PFDNormalPanelMCPAltitudeCircle", 0.75 * (ConvertUnit(PFD.MCP.Altitude.Value, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) + 2000) - 10 + "px");
							} else {
								Fade("Ctrl_PFDNormalPanelMCPAltitudeCircle");
							}

					// Balloon
					if(PFD0.Stats.Altitude.TapeDisplay >= 0) {
						ChangeTop("RollingDigit_PFDNormalPanelAltitude1", -45 * (5 - PFD0.Stats.Altitude.BalloonDisplay[1]) + "px");
					} else {
						ChangeTop("RollingDigit_PFDNormalPanelAltitude1", "-270px");
					}
					ChangeTop("RollingDigit_PFDNormalPanelAltitude2", -45 * (10 - PFD0.Stats.Altitude.BalloonDisplay[2]) + "px");
					ChangeTop("RollingDigit_PFDNormalPanelAltitude3", -45 * (10 - PFD0.Stats.Altitude.BalloonDisplay[3]) + "px");
					switch(true) {
						case ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) < -1980:
							ChangeTop("RollingDigit_PFDNormalPanelAltitude4", 17.5 - 25 * (21 - PFD0.Stats.Altitude.BalloonDisplay[4] / 20) + "px");
							break;
						case ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) >= -1980 &&
						ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) <= -20:
							ChangeTop("RollingDigit_PFDNormalPanelAltitude4", 17.5 - 25 * (17 - PFD0.Stats.Altitude.BalloonDisplay[4] / 20) + "px");
							break;
						case ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) > -20 &&
						ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) < 20:
							ChangeTop("RollingDigit_PFDNormalPanelAltitude4", 17.5 - 25 * (13 - PFD0.Stats.Altitude.BalloonDisplay[4] / 20) + "px");
							break;
						case ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) >= 20 &&
						ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) <= 49980:
							ChangeTop("RollingDigit_PFDNormalPanelAltitude4", 17.5 - 25 * (9 - PFD0.Stats.Altitude.BalloonDisplay[4] / 20) + "px");
							break;
						case ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) > 49980:
							ChangeTop("RollingDigit_PFDNormalPanelAltitude4", 17.5 - 25 * (5 - PFD0.Stats.Altitude.BalloonDisplay[4] / 20) + "px");
							break;
						default:
							AlertSystemError("The value of ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, \"Meter\", Subsystem.I18n.MeasurementUnit.Altitude) \"" + ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) + "\" in function RefreshNormalPanel is invalid.");
							break;
					}
					if(PFD0.Stats.ClockTime - PFD0.Stats.Altitude.BeepTimestamp < 10000 && PFD0.Alert.Active.AltitudeWarning == "") {
						AddClass("Ctrl_PFDNormalPanelAltitudeBalloonBalloon", "Reminder");
					} else {
						RemoveClass("Ctrl_PFDNormalPanelAltitudeBalloonBalloon", "Reminder");
					}
					if(PFD0.Alert.Active.AltitudeWarning != "" && PFD0.Alert.Active.AltitudeWarning != "GlideSlope") {
						AddClass("Ctrl_PFDNormalPanelAltitudeBalloonBalloon", "Warning");
					} else {
						RemoveClass("Ctrl_PFDNormalPanelAltitudeBalloonBalloon", "Warning");
					}

					// MCP
					if(PFD.MCP.Altitude.IsEnabled == true) {
						Show("Ctrl_PFDNormalPanelMCPAltitude");
						ChangeText("Label_PFDNormalPanelMCPAltitude", Math.trunc(ConvertUnit(PFD.MCP.Altitude.Value, "Meter", Subsystem.I18n.MeasurementUnit.Altitude).toFixed(0) / 100) +
							"<span class=\"SmallerText\">" + Math.abs(ConvertUnit(PFD.MCP.Altitude.Value, "Meter", Subsystem.I18n.MeasurementUnit.Altitude).toFixed(0) % 100).toString().padStart(2, "0") + "</span>");
					}

					// Metric
					switch(Subsystem.I18n.MeasurementUnit.Altitude) {
						case "Meter":
						case "Foot":
							break;
						case "FootButShowMeterBeside":
							Show("Ctrl_PFDNormalPanelMetricAltitude");
							ChangeText("Label_PFDNormalPanelMetricAltitude", PFD0.Stats.Altitude.TapeDisplay.toFixed(0) + "<span class=\"SmallerText\">" + Translate("MeterOnPFD") + "</span>");
							break;
						default:
							AlertSystemError("The value of Subsystem.I18n.MeasurementUnit.Altitude \"" + Subsystem.I18n.MeasurementUnit.Altitude + "\" in function RefreshNormalPanel is invalid.");
							break;
					}
				} else {
					Show("Ctrl_PFDNormalPanelAltitudeStatus");
					ChangeText("Label_PFDNormalPanelAltitudeStatus", Translate("AltitudeUnavailable"));
				}

				// Vertical speed
				Fade("Ctrl_PFDNormalPanelVerticalSpeedStatus");
				Fade("Ctrl_PFDNormalPanelVerticalSpeedTape");
				Fade("Ctrl_PFDNormalPanelVerticalSpeedAdditionalIndicators");
				Fade("Ctrl_PFDNormalPanelVerticalSpeedNeedle");
				Fade("Ctrl_PFDNormalPanelVerticalSpeedBalloon");
				Fade("Ctrl_PFDNormalPanelMCPVerticalSpeed");
				if((PFD.Altitude.Mode == "GPS" && PFD0.Status.GPS.IsAltitudeAvailable == true) ||
				(PFD.Altitude.Mode == "Accel" && PFD0.Status.Accel.IsAvailable == true) ||
				(PFD.Altitude.Mode == "DualChannel" && (PFD0.Status.GPS.IsAltitudeAvailable == true || PFD0.Status.Accel.IsAvailable == true)) ||
				PFD.Altitude.Mode == "Manual") {
					// Show ctrls
					Show("Ctrl_PFDNormalPanelVerticalSpeedTape");
					Show("Ctrl_PFDNormalPanelVerticalSpeedAdditionalIndicators");
					Show("Ctrl_PFDNormalPanelVerticalSpeedNeedle");
					if(System.Display.Anim > 0) {
						ChangeAnim("Ctrl_PFDNormalPanelVerticalSpeedNeedle", "100ms");
					} else {
						ChangeAnim("Ctrl_PFDNormalPanelVerticalSpeedNeedle", "");
					}

					// Additional indicators
						// Other vertical speeds
							// MCP
							if(PFD.MCP.VerticalSpeed.IsEnabled == true) {
								Show("Ctrl_PFDNormalPanelMCPVerticalSpeedCircle");
								let ConvertedVerticalSpeed = ConvertUnit(PFD.MCP.VerticalSpeed.Value, "MeterPerSec", Subsystem.I18n.MeasurementUnit.VerticalSpeed),
								VerticalPixels = 0;
								switch(Subsystem.I18n.MeasurementUnit.VerticalSpeed) {
									case "MeterPerSec":
										switch(true) {
											case ConvertedVerticalSpeed <= -6:
												VerticalPixels = -180;
												break;
											case ConvertedVerticalSpeed > -6 && ConvertedVerticalSpeed <= -2:
												VerticalPixels = -120 + 60 * ((ConvertedVerticalSpeed + 2) / 4);
												break;
											case ConvertedVerticalSpeed > -2 && ConvertedVerticalSpeed < 2:
												VerticalPixels = 120 * (ConvertedVerticalSpeed / 2);
												break;
											case ConvertedVerticalSpeed >= 2 && ConvertedVerticalSpeed < 6:
												VerticalPixels = 120 + 60 * ((ConvertedVerticalSpeed - 2) / 4);
												break;
											case ConvertedVerticalSpeed >= 6:
												VerticalPixels = 180;
												break;
											default:
												AlertSystemError("The value of ConvertedVerticalSpeed \"" + ConvertedVerticalSpeed + "\" in function RefreshNormalPanel is invalid.");
												break;
										}
										break;
									case "FeetPerMin":
										switch(true) {
											case ConvertedVerticalSpeed <= -6000:
												VerticalPixels = -180;
												break;
											case ConvertedVerticalSpeed > -6000 && ConvertedVerticalSpeed <= -2000:
												VerticalPixels = -120 + 60 * ((ConvertedVerticalSpeed + 2000) / 4000);
												break;
											case ConvertedVerticalSpeed > -2000 && ConvertedVerticalSpeed < 2000:
												VerticalPixels = 120 * (ConvertedVerticalSpeed / 2000);
												break;
											case ConvertedVerticalSpeed >= 2000 && ConvertedVerticalSpeed < 6000:
												VerticalPixels = 120 + 60 * ((ConvertedVerticalSpeed - 2000) / 4000);
												break;
											case ConvertedVerticalSpeed >= 6000:
												VerticalPixels = 180;
												break;
											default:
												AlertSystemError("The value of ConvertedVerticalSpeed \"" + ConvertedVerticalSpeed + "\" in function RefreshNormalPanel is invalid.");
												break;
										}
										break;
									default:
										AlertSystemError("The value of Subsystem.I18n.MeasurementUnit.VerticalSpeed \"" + Subsystem.I18n.MeasurementUnit.VerticalSpeed + "\" in function RefreshNormalPanel is invalid.");
										break;
								}
								ChangeBottom("Ctrl_PFDNormalPanelMCPVerticalSpeedCircle", 170 + VerticalPixels + "px");
							} else {
								Fade("Ctrl_PFDNormalPanelMCPVerticalSpeedCircle");
							}

					// Needle
						// Calc needle angle
						let ConvertedVerticalSpeed = ConvertUnit(PFD0.Stats.Speed.Vertical, "MeterPerSec", Subsystem.I18n.MeasurementUnit.VerticalSpeed),
						VerticalPixels = 0, NeedleAngle = 0;
						switch(Subsystem.I18n.MeasurementUnit.VerticalSpeed) {
							case "MeterPerSec":
								switch(true) {
									case ConvertedVerticalSpeed <= -6:
										VerticalPixels = -180;
										break;
									case ConvertedVerticalSpeed > -6 && ConvertedVerticalSpeed <= -2:
										VerticalPixels = -120 + 60 * ((ConvertedVerticalSpeed + 2) / 4);
										break;
									case ConvertedVerticalSpeed > -2 && ConvertedVerticalSpeed < 2:
										VerticalPixels = 120 * (ConvertedVerticalSpeed / 2);
										break;
									case ConvertedVerticalSpeed >= 2 && ConvertedVerticalSpeed < 6:
										VerticalPixels = 120 + 60 * ((ConvertedVerticalSpeed - 2) / 4);
										break;
									case ConvertedVerticalSpeed >= 6:
										VerticalPixels = 180;
										break;
									default:
										AlertSystemError("The value of ConvertedVerticalSpeed \"" + ConvertedVerticalSpeed + "\" in function RefreshNormalPanel is invalid.");
										break;
								}
								break;
							case "FeetPerMin":
								switch(true) {
									case ConvertedVerticalSpeed <= -6000:
										VerticalPixels = -180;
										break;
									case ConvertedVerticalSpeed > -6000 && ConvertedVerticalSpeed <= -2000:
										VerticalPixels = -120 + 60 * ((ConvertedVerticalSpeed + 2000) / 4000);
										break;
									case ConvertedVerticalSpeed > -2000 && ConvertedVerticalSpeed < 2000:
										VerticalPixels = 120 * (ConvertedVerticalSpeed / 2000);
										break;
									case ConvertedVerticalSpeed >= 2000 && ConvertedVerticalSpeed < 6000:
										VerticalPixels = 120 + 60 * ((ConvertedVerticalSpeed - 2000) / 4000);
										break;
									case ConvertedVerticalSpeed >= 6000:
										VerticalPixels = 180;
										break;
									default:
										AlertSystemError("The value of ConvertedVerticalSpeed \"" + ConvertedVerticalSpeed + "\" in function RefreshNormalPanel is invalid.");
										break;
								}
								break;
							default:
								AlertSystemError("The value of Subsystem.I18n.MeasurementUnit.VerticalSpeed \"" + Subsystem.I18n.MeasurementUnit.VerticalSpeed + "\" in function RefreshNormalPanel is invalid.");
								break;
						}
						NeedleAngle = RadToDeg(Math.atan(VerticalPixels / 100));

						// Refresh needle
						let NeedleLength = 100 / Math.cos(DegToRad(NeedleAngle));
						ChangeRotate("Needle_PFDNormalPanelVerticalSpeed", -90 + NeedleAngle);
						ChangeTop("Needle_PFDNormalPanelVerticalSpeed", "calc(50% - " + NeedleLength + "px)");
						ChangeHeight("Needle_PFDNormalPanelVerticalSpeed", NeedleLength * 2 + "px");

					// Balloon
					if((Subsystem.I18n.MeasurementUnit.VerticalSpeed == "MeterPerSec" && Math.abs(ConvertedVerticalSpeed) >= 1) ||
					(Subsystem.I18n.MeasurementUnit.VerticalSpeed == "FeetPerMin" && Math.abs(ConvertedVerticalSpeed) >= 400)) {
						Show("Ctrl_PFDNormalPanelVerticalSpeedBalloon");
						let VerticalSpeedDisplay = 0;
						switch(Subsystem.I18n.MeasurementUnit.VerticalSpeed) {
							case "MeterPerSec":
								VerticalSpeedDisplay = CheckRangeAndCorrect(Math.trunc(ConvertedVerticalSpeed / 0.2) * 0.2, -50, 50);
								if(VerticalSpeedDisplay >= 0) {
									ChangeText("Label_PFDNormalPanelVerticalSpeedBalloon", "+" + VerticalSpeedDisplay.toFixed(1));
								} else {
									ChangeText("Label_PFDNormalPanelVerticalSpeedBalloon", VerticalSpeedDisplay.toFixed(1));
								}
								break;
							case "FeetPerMin":
								VerticalSpeedDisplay = CheckRangeAndCorrect(Math.trunc(ConvertedVerticalSpeed / 50) * 50, -9999, 9999);
								if(VerticalSpeedDisplay >= 0) {
									ChangeText("Label_PFDNormalPanelVerticalSpeedBalloon", "+" + VerticalSpeedDisplay);
								} else {
									ChangeText("Label_PFDNormalPanelVerticalSpeedBalloon", VerticalSpeedDisplay);
								}
								break;
							default:
								AlertSystemError("The value of Subsystem.I18n.MeasurementUnit.VerticalSpeed \"" + Subsystem.I18n.MeasurementUnit.VerticalSpeed + "\" in function RefreshNormalPanel is invalid.");
								break;
						}
					}

					// MCP
					if(PFD.MCP.VerticalSpeed.IsEnabled == true) {
						Show("Ctrl_PFDNormalPanelMCPVerticalSpeed");
						ConvertedVerticalSpeed = ConvertUnit(PFD.MCP.VerticalSpeed.Value, "MeterPerSec", Subsystem.I18n.MeasurementUnit.VerticalSpeed);
						switch(Subsystem.I18n.MeasurementUnit.VerticalSpeed) {
							case "MeterPerSec":
								if(ConvertedVerticalSpeed >= 0) {
									ChangeText("Label_PFDNormalPanelMCPVerticalSpeed", "+" + ConvertedVerticalSpeed.toFixed(1));
								} else {
									ChangeText("Label_PFDNormalPanelMCPVerticalSpeed", ConvertedVerticalSpeed.toFixed(1));
								}
								break;
							case "FeetPerMin":
								if(ConvertedVerticalSpeed >= 0) {
									ChangeText("Label_PFDNormalPanelMCPVerticalSpeed", "+" + ConvertedVerticalSpeed.toFixed(0));
								} else {
									ChangeText("Label_PFDNormalPanelMCPVerticalSpeed", ConvertedVerticalSpeed.toFixed(0));
								}
								break;
							default:
								AlertSystemError("The value of Subsystem.I18n.MeasurementUnit.VerticalSpeed \"" + Subsystem.I18n.MeasurementUnit.VerticalSpeed + "\" in function RefreshNormalPanel is invalid.");
								break;
						}
					}
				} else {
					Show("Ctrl_PFDNormalPanelVerticalSpeedStatus");
					ChangeText("Label_PFDNormalPanelVerticalSpeedStatus", Translate("VerticalSpeedUnavailable"));
				}

				// Heading
				Fade("Ctrl_PFDNormalPanelHeadingStatus");
				Fade("Ctrl_PFDNormalPanelHeadingTape");
				Fade("Ctrl_PFDNormalPanelHeadingAdditionalIndicators");
				Fade("Ctrl_PFDNormalPanelHeadingBalloon");
				Fade("Ctrl_PFDNormalPanelMCPHeading");
				if((PFD.Heading.Mode == "GPS" && PFD0.Status.GPS.IsHeadingAvailable == true) ||
				PFD.Heading.Mode == "Manual") {
					Show("Ctrl_PFDNormalPanelHeadingTape");
					Show("Ctrl_PFDNormalPanelHeadingAdditionalIndicators");
					Show("Ctrl_PFDNormalPanelHeadingBalloon");
					if(System.Display.Anim > 0) {
						ChangeAnim("Ctrl_PFDNormalPanelHeadingTape", "100ms");
						ChangeAnim("Ctrl_PFDNormalPanelHeadingAdditionalIndicators", "100ms");
					} else {
						ChangeAnim("Ctrl_PFDNormalPanelHeadingTape", "");
						ChangeAnim("Ctrl_PFDNormalPanelHeadingAdditionalIndicators", "");
					}
					ChangeRotate("CtrlGroup_PFDNormalPanelHeadingTape", -PFD0.Stats.Heading.Display);
					if(PFD.Nav.IsEnabled == true && PFD0.Status.GPS.IsPositionAvailable == true) {
						Show("Ctrl_PFDNormalPanelBearing");
						ChangeRotate("Ctrl_PFDNormalPanelBearing", PFD0.Stats.Nav.Bearing - PFD0.Stats.Heading.Display);
					} else {
						Fade("Ctrl_PFDNormalPanelBearing");
					}
					if(PFD.MCP.Heading.IsEnabled == true) {
						Show("Ctrl_PFDNormalPanelMCPHeadingCircle");
						ChangeRotate("Ctrl_PFDNormalPanelMCPHeadingCircle", PFD.MCP.Heading.Value - PFD0.Stats.Heading.Display);
					} else {
						Fade("Ctrl_PFDNormalPanelMCPHeadingCircle");
					}
					ChangeText("Label_PFDNormalPanelHeadingBalloon", PFD0.Stats.Heading.Display.toFixed(0).toString().padStart(3, "0"));
					if(PFD.MCP.Heading.IsEnabled == true) {
						Show("Ctrl_PFDNormalPanelMCPHeading");
						ChangeText("Label_PFDNormalPanelMCPHeading", PFD.MCP.Heading.Value.toFixed(0).toString().padStart(3, "0"));
					}
				} else {
					Show("Ctrl_PFDNormalPanelHeadingStatus");
					ChangeText("Label_PFDNormalPanelHeadingStatus", Translate("HeadingUnavailable"));
				}

				// DME
				if(PFD.Nav.IsEnabled == true && PFD0.Status.GPS.IsPositionAvailable == true) {
					Show("Ctnr_PFDNormalPanelDME");
					ChangeText("Label_PFDNormalPanelDMERunway", Translate("Runway") + " " + AirportLibrary0.ActiveRunwayName);
					if(PFD0.Stats.Nav.DistanceDisplay < 10000000) { // Max 10000 kilometers.
						ChangeText("Label_PFDNormalPanelDMEDistance", ConvertUnit(PFD0.Stats.Nav.DistanceDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Distance).toFixed(1) + "<span class=\"SmallerText\">" + Translate(Subsystem.I18n.MeasurementUnit.Distance + "OnPFD") + "</span>");
						if(PFD0.Stats.Speed.GSDisplay > 0 && PFD0.Stats.Nav.ETA < 360000000) { // Max 100 hours.
							ChangeText("Label_PFDNormalPanelDMEETA",
								Math.trunc(PFD0.Stats.Nav.ETA / 3600000) + "<span class=\"SmallerText\">" + Translate("Hour") + "</span>" +
								Math.trunc(PFD0.Stats.Nav.ETA % 3600000 / 60000).toString().padStart(2, "0") + "<span class=\"SmallerText\">" + Translate("Minute") + "</span>");
						} else {
							ChangeText("Label_PFDNormalPanelDMEETA", "--<span class=\"SmallerText\">" + Translate("Hour") + "</span>--<span class=\"SmallerText\">" + Translate("Minute") + "</span>");
						}
					} else {
						ChangeText("Label_PFDNormalPanelDMEDistance", Translate("DistanceTooFar"));
						ChangeText("Label_PFDNormalPanelDMEETA", "--<span class=\"SmallerText\">" + Translate("Hour") + "</span>--<span class=\"SmallerText\">" + Translate("Minute") + "</span>");
					}
				} else {
					Fade("Ctnr_PFDNormalPanelDME");
				}

				// Localizer
				Fade("Ctnr_PFDNormalPanelLocalizer");
				if(PFD.Nav.IsEnabled == true &&
				PFD0.Status.GPS.IsPositionAvailable == true &&
				(
					(PFD.Heading.Mode == "GPS" && PFD0.Status.GPS.IsHeadingAvailable == true) ||
					PFD.Heading.Mode == "Manual"
				)) {
					switch(PFD.FlightMode.FlightMode) {
						case "DepartureGround":
						case "TakeOff":
						case "Cruise":
						case "ArrivalGround":
							break;
						case "Land":
						case "EmergencyReturn":
							Show("Ctnr_PFDNormalPanelLocalizer");
							switch(true) {
								case PFD0.Stats.Nav.LocalizerDeviation <= -2:
									ChangeLeft("PFDNormalPanelLocalizerPointer", 237.5 + "px");
									break;
								case PFD0.Stats.Nav.LocalizerDeviation > -2 && PFD0.Stats.Nav.LocalizerDeviation < 2:
									ChangeLeft("PFDNormalPanelLocalizerPointer", 117.5 - 120 * (PFD0.Stats.Nav.LocalizerDeviation / 2) + "px");
									break;
								case PFD0.Stats.Nav.LocalizerDeviation >= 2:
									ChangeLeft("PFDNormalPanelLocalizerPointer", -2.5 + "px");
									break;
								default:
									AlertSystemError("The value of PFD0.Stats.Nav.LocalizerDeviation \"" + PFD0.Stats.Nav.LocalizerDeviation + "\" in function RefreshNormalPanel is invalid.");
									break;
							}
							if(System.Display.Anim > 0) {
								ChangeAnim("PFDNormalPanelLocalizerPointer", "100ms");
							} else {
								ChangeAnim("PFDNormalPanelLocalizerPointer", "");
							}
							break;
						default:
							AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshNormalPanel is invalid.");
							break;
					}
				}

				// Glide slope
				Fade("Ctnr_PFDNormalPanelGlideSlope");
				if(PFD.Nav.IsEnabled == true &&
				PFD0.Status.GPS.IsPositionAvailable == true &&
				(
					(PFD.Altitude.Mode == "GPS" && PFD0.Status.GPS.IsAltitudeAvailable == true) ||
					(PFD.Altitude.Mode == "Accel" && PFD0.Status.Accel.IsAvailable == true) ||
					(PFD.Altitude.Mode == "DualChannel" && (PFD0.Status.GPS.IsAltitudeAvailable == true || PFD0.Status.Accel.IsAvailable == true)) ||
					PFD.Altitude.Mode == "Manual"
				)) {
					switch(PFD.FlightMode.FlightMode) {
						case "DepartureGround":
						case "TakeOff":
						case "Cruise":
						case "ArrivalGround":
							break;
						case "Land":
						case "EmergencyReturn":
							Show("Ctnr_PFDNormalPanelGlideSlope");
							switch(true) {
								case PFD0.Stats.Nav.GlideSlopeDeviation <= -0.7:
									ChangeTop("PFDNormalPanelGlideSlopePointer", -2.5 + "px");
									break;
								case PFD0.Stats.Nav.GlideSlopeDeviation > -0.7 && PFD0.Stats.Nav.GlideSlopeDeviation < 0.7:
									ChangeTop("PFDNormalPanelGlideSlopePointer", 117.5 + 120 * (PFD0.Stats.Nav.GlideSlopeDeviation / 0.7) + "px");
									break;
								case PFD0.Stats.Nav.GlideSlopeDeviation >= 0.7:
									ChangeTop("PFDNormalPanelGlideSlopePointer", 237.5 + "px");
									break;
								default:
									AlertSystemError("The value of PFD0.Stats.Nav.GlideSlopeDeviation \"" + PFD0.Stats.Nav.GlideSlopeDeviation + "\" in function RefreshNormalPanel is invalid.");
									break;
							}
							if(System.Display.Anim > 0) {
								ChangeAnim("PFDNormalPanelGlideSlopePointer", "100ms");
							} else {
								ChangeAnim("PFDNormalPanelGlideSlopePointer", "");
							}
							if(PFD0.Alert.Active.AltitudeWarning == "GlideSlope") {
								AddClass("PFDNormalPanelGlideSlopePointer", "GlideSlopeWarning");
							} else {
								RemoveClass("PFDNormalPanelGlideSlopePointer", "GlideSlopeWarning");
							}
							break;
						default:
							AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshNormalPanel is invalid.");
							break;
					}
				}

				// Marker beacon
				Fade("Ctnr_PFDNormalPanelMarkerBeacon");
				if(PFD.Nav.IsEnabled == true &&
				PFD0.Status.GPS.IsPositionAvailable == true &&
				(
					(PFD.Altitude.Mode == "GPS" && PFD0.Status.GPS.IsAltitudeAvailable == true) ||
					(PFD.Altitude.Mode == "Accel" && PFD0.Status.Accel.IsAvailable == true) ||
					(PFD.Altitude.Mode == "DualChannel" && (PFD0.Status.GPS.IsAltitudeAvailable == true || PFD0.Status.Accel.IsAvailable == true)) ||
					PFD.Altitude.Mode == "Manual"
				) &&
				(
					(PFD.Heading.Mode == "GPS" && PFD0.Status.GPS.IsHeadingAvailable == true) ||
					PFD.Heading.Mode == "Manual"
				)) {
					switch(PFD.FlightMode.FlightMode) {
						case "DepartureGround":
						case "TakeOff":
						case "Cruise":
						case "ArrivalGround":
							break;
						case "Land":
						case "EmergencyReturn":
							switch(PFD0.Stats.Nav.MarkerBeacon) {
								case "":
									break;
								case "OuterMarker":
								case "MiddleMarker":
								case "InnerMarker":
									Show("Ctnr_PFDNormalPanelMarkerBeacon");
									ChangeMarkerBeacon(PFD0.Stats.Nav.MarkerBeacon);
									ChangeText("Label_PFDNormalPanelMarkerBeacon", Translate(PFD0.Stats.Nav.MarkerBeacon));
									break;
								default:
									AlertSystemError("The value of PFD0.Stats.Nav.MarkerBeacon \"" + PFD0.Stats.Nav.MarkerBeacon + "\" in function RefreshNormalPanel is invalid.");
									break;
							}
							break;
						default:
							AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshNormalPanel is invalid.");
							break;
					}
				}

				// Radio altitude
				if((
					(PFD.Altitude.Mode == "GPS" && PFD0.Status.GPS.IsAltitudeAvailable == true) ||
					(PFD.Altitude.Mode == "Accel" && PFD0.Status.Accel.IsAvailable == true) ||
					(PFD.Altitude.Mode == "DualChannel" && (PFD0.Status.GPS.IsAltitudeAvailable == true || PFD0.Status.Accel.IsAvailable == true)) ||
					PFD.Altitude.Mode == "Manual"
				) &&
				PFD0.Stats.Altitude.RadioDisplay > -304.8 && PFD0.Stats.Altitude.RadioDisplay <= 762) {
					Show("Ctnr_PFDNormalPanelRadioAltitude");
					let ConvertedRadioAltitude = ConvertUnit(PFD0.Stats.Altitude.RadioDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude),
					ConvertedRadioAltitudeDisplay = 0;
					switch(true) {
						case Math.abs(ConvertedRadioAltitude) >= 500:
							switch(Subsystem.I18n.MeasurementUnit.Altitude) {
								case "Meter":
									ConvertedRadioAltitudeDisplay = Math.round(ConvertedRadioAltitude / 10) * 10;
									break;
								case "Foot":
								case "FootButShowMeterBeside":
									ConvertedRadioAltitudeDisplay = Math.round(ConvertedRadioAltitude / 20) * 20;
									break;
								default:
									AlertSystemError("The value of Subsystem.I18n.MeasurementUnit.Altitude \"" + Subsystem.I18n.MeasurementUnit.Altitude + "\" in function RefreshNormalPanel is invalid.");
									break;
							}
							break;
						case Math.abs(ConvertedRadioAltitude) >= 100 && Math.abs(ConvertedRadioAltitude) < 500:
							switch(Subsystem.I18n.MeasurementUnit.Altitude) {
								case "Meter":
									ConvertedRadioAltitudeDisplay = Math.round(ConvertedRadioAltitude / 5) * 5;
									break;
								case "Foot":
								case "FootButShowMeterBeside":
									ConvertedRadioAltitudeDisplay = Math.round(ConvertedRadioAltitude / 10) * 10;
									break;
								default:
									AlertSystemError("The value of Subsystem.I18n.MeasurementUnit.Altitude \"" + Subsystem.I18n.MeasurementUnit.Altitude + "\" in function RefreshNormalPanel is invalid.");
									break;
							}
							break;
						case Math.abs(ConvertedRadioAltitude) < 100:
							switch(Subsystem.I18n.MeasurementUnit.Altitude) {
								case "Meter":
									ConvertedRadioAltitudeDisplay = Math.round(ConvertedRadioAltitude);
									break;
								case "Foot":
								case "FootButShowMeterBeside":
									ConvertedRadioAltitudeDisplay = Math.round(ConvertedRadioAltitude / 2) * 2;
									break;
								default:
									AlertSystemError("The value of Subsystem.I18n.MeasurementUnit.Altitude \"" + Subsystem.I18n.MeasurementUnit.Altitude + "\" in function RefreshNormalPanel is invalid.");
									break;
							}
							break;
						default:
							AlertSystemError("The value of Math.abs(ConvertedRadioAltitude) \"" + Math.abs(ConvertedRadioAltitude) + "\" in function RefreshNormalPanel is invalid.");
							break;
					}
					ChangeText("ProgringText_PFDNormalPanelRadioAltitude", ConvertedRadioAltitudeDisplay);
					Fade("CtrlGroup_PFDNormalPanelRadioAltitudeDialScale");
					Fade("Progring_PFDNormalPanelRadioAltitude");
					if(ConvertedRadioAltitudeDisplay > -100 && ConvertedRadioAltitudeDisplay < 1000) {
						Show("CtrlGroup_PFDNormalPanelRadioAltitudeDialScale");
						if(ConvertedRadioAltitude >= 0) {
							Show("Progring_PFDNormalPanelRadioAltitude");
							document.getElementById("ProgringFg_PFDNormalPanelRadioAltitude").style.strokeDasharray = (Math.PI * 82) * (ConvertedRadioAltitude / 1000) + "px, " + (Math.PI * 82) * (1 - ConvertedRadioAltitude / 1000) + "px";
							if(System.Display.Anim > 0) {
								ChangeAnim("ProgringFg_PFDNormalPanelRadioAltitude", "100ms");
							} else {
								ChangeAnim("ProgringFg_PFDNormalPanelRadioAltitude", "");
							}
						}
					}
				} else {
					Fade("Ctnr_PFDNormalPanelRadioAltitude");
				}

				// Decision altitude
				Fade("Ctnr_PFDNormalPanelDecisionAltitude");
				if((PFD.Altitude.Mode == "GPS" && PFD0.Status.GPS.IsAltitudeAvailable == true) ||
				(PFD.Altitude.Mode == "Accel" && PFD0.Status.Accel.IsAvailable == true) ||
				(PFD.Altitude.Mode == "DualChannel" && (PFD0.Status.GPS.IsAltitudeAvailable == true || PFD0.Status.Accel.IsAvailable == true)) ||
				PFD.Altitude.Mode == "Manual") {
					switch(PFD.FlightMode.FlightMode) {
						case "DepartureGround":
						case "TakeOff":
						case "Cruise":
							break;
						case "Land":
						case "ArrivalGround":
						case "EmergencyReturn":
							Show("Ctnr_PFDNormalPanelDecisionAltitude");
							ChangeText("Label_PFDNormalPanelDecisionAltitudeValue", Math.trunc(ConvertUnit(PFD0.Stats.Altitude.Ground + AirportLibrary0.ActiveAirport.Runway[AirportLibrary0.ActiveAirport.RunwaySelection].DecisionHeight, "Meter", Subsystem.I18n.MeasurementUnit.Altitude)));
							if(PFD0.Status.IsDecisionAltitudeActive == true) {
								AddClass("Ctnr_PFDNormalPanelDecisionAltitude", "Active");
								if(PFD0.Stats.ClockTime - PFD0.Stats.Altitude.DecisionTimestamp < 3000) {
									AddClass("Ctnr_PFDNormalPanelDecisionAltitude", "Caution");
								} else {
									RemoveClass("Ctnr_PFDNormalPanelDecisionAltitude", "Caution");
								}
							} else {
								RemoveClass("Ctnr_PFDNormalPanelDecisionAltitude", "Active");
								RemoveClass("Ctnr_PFDNormalPanelDecisionAltitude", "Caution");
							}
							break;
						default:
							AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshNormalPanel is invalid.");
							break;
					}
				}

				// Warning
				Fade("Ctnr_PFDNormalPanelWarning");
				if(PFD0.Alert.Active.AttitudeWarning != "") {
					Show("Ctnr_PFDNormalPanelWarning");
					ChangeText("Label_PFDNormalPanelWarning", Translate(PFD0.Alert.Active.AttitudeWarning));
				}
				if(PFD0.Alert.Active.SpeedWarning != "") {
					Show("Ctnr_PFDNormalPanelWarning");
					ChangeText("Label_PFDNormalPanelWarning", Translate(PFD0.Alert.Active.SpeedWarning));
				}
				if(PFD0.Alert.Active.AltitudeWarning != "") {
					Show("Ctnr_PFDNormalPanelWarning");
					ChangeText("Label_PFDNormalPanelWarning", Translate(PFD0.Alert.Active.AltitudeWarning));
				}
			}
