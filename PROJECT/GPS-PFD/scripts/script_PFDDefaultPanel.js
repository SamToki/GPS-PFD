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
			function RefreshDefaultPanel() {
				// Info bar
				if(PFD0.Status.GPS.PermissionStatus != "Denied") {
					if(PFD0.Status.GPS.IsPositionAvailable == true) {
						RemoveClass("Ctrl_PFDDefaultPanelGPS", "OrangeText");
						if(PFD0.Status.GPS.IsPositionAccurate == true && PFD0.Status.GPS.IsAltitudeAvailable == true && PFD0.Status.GPS.IsAltitudeAccurate == true) {
							ChangeText("Label_PFDDefaultPanelGPSValue", Translate("Normal"));
						} else {
							ChangeText("Label_PFDDefaultPanelGPSValue", Translate("SignalWeak"));
						}
					} else {
						AddClass("Ctrl_PFDDefaultPanelGPS", "OrangeText");
						ChangeText("Label_PFDDefaultPanelGPSValue", Translate("Unavailable"));
					}
				} else {
					AddClass("Ctrl_PFDDefaultPanelGPS", "OrangeText");
					ChangeText("Label_PFDDefaultPanelGPSValue", Translate("Denied"));
				}
				if(PFD0.Status.Accel.PermissionStatus != "Denied") {
					if(PFD0.Status.Accel.IsAvailable == true) {
						RemoveClass("Ctrl_PFDDefaultPanelAccel", "OrangeText");
						ChangeText("Label_PFDDefaultPanelAccelValue", Translate("Normal"));
					} else {
						AddClass("Ctrl_PFDDefaultPanelAccel", "OrangeText");
						ChangeText("Label_PFDDefaultPanelAccelValue", Translate("Unavailable"));
					}
				} else {
					AddClass("Ctrl_PFDDefaultPanelAccel", "OrangeText");
					ChangeText("Label_PFDDefaultPanelAccelValue", Translate("Denied"));
				}
				if((PFD.Speed.Mode == "GPS" && PFD0.Status.GPS.IsSpeedAvailable == true) ||
				(PFD.Speed.Mode == "Accel" && PFD0.Status.Accel.IsAvailable == true) ||
				(PFD.Speed.Mode == "DualChannel" && (PFD0.Status.GPS.IsSpeedAvailable == true || PFD0.Status.Accel.IsAvailable == true)) ||
				PFD.Speed.Mode == "Manual") {
					ChangeText("Label_PFDDefaultPanelGSValue", ConvertUnit(PFD0.Stats.Speed.GSDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed).toFixed(0) + "<span class=\"SmallerText\">" + Translate(Subsystem.I18n.MeasurementUnit.Speed + "OnPFD") + "</span>");
					ChangeText("Label_PFDDefaultPanelAvgGSValue", ConvertUnit(PFD0.Stats.Speed.AvgGSDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed).toFixed(0) + "<span class=\"SmallerText\">" + Translate(Subsystem.I18n.MeasurementUnit.Speed + "OnPFD") + "</span>");
					ChangeText("Label_PFDDefaultPanelTASValue", ConvertUnit(PFD0.Stats.Speed.TASDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed).toFixed(0) + "<span class=\"SmallerText\">" + Translate(Subsystem.I18n.MeasurementUnit.Speed + "OnPFD") + "</span>");
				} else {
					ChangeText("Label_PFDDefaultPanelGSValue", "---");
					ChangeText("Label_PFDDefaultPanelAvgGSValue", "---");
					ChangeText("Label_PFDDefaultPanelTASValue", "---");
				}
				if(PFD.Speed.Wind.Speed > 0) {
					ChangeText("Label_PFDDefaultPanelWindValue", PFD.Speed.Wind.Direction.toString().padStart(3, "0") + "°/" + ConvertUnit(PFD.Speed.Wind.Speed, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed).toFixed(0));
					if((PFD.Heading.Mode == "GPS" && PFD0.Status.GPS.IsHeadingAvailable == true) ||
					PFD.Heading.Mode == "Manual") {
						Show("PFDDefaultPanelWindDirection");
						ChangeRotate("Needle_PFDDefaultPanelWindDirection", PFD0.Stats.Speed.Wind.RelativeHeading);
					} else {
						Fade("PFDDefaultPanelWindDirection");
					}
				} else {
					ChangeText("Label_PFDDefaultPanelWindValue", Translate("NoWind"));
					Fade("PFDDefaultPanelWindDirection");
				}
				if(PFD.Flaps > 0) {
					ChangeText("Label_PFDDefaultPanelFlapsValue", PFD.Flaps + "%");
				} else {
					ChangeText("Label_PFDDefaultPanelFlapsValue", Translate("FlapsUp"));
				}
				ChangeProgbar("ProgbarFg_PFDDefaultPanelFlaps", "Vertical", PFD.Flaps);

				// FMA
				ChangeText("Label_PFDDefaultPanelSpeedModeValue", Translate(PFD.Speed.Mode));
				ChangeText("Label_PFDDefaultPanelAltitudeModeValue", Translate(PFD.Altitude.Mode));
				ChangeText("Label_PFDDefaultPanelHeadingModeValue", Translate(PFD.Heading.Mode));
				ChangeText("Label_PFDDefaultPanelFlightMode", Translate(PFD.FlightMode.FlightMode));
				if(PFD0.Stats.ClockTime - PFD0.Stats.FlightModeTimestamp < 10000) {
					AddClass("Ctnr_PFDDefaultPanelFMA2", "Reminder");
				} else {
					RemoveClass("Ctnr_PFDDefaultPanelFMA2", "Reminder");
				}

				// Attitude
				Fade("Ctrl_PFDDefaultPanelAttitudeStatus");
				Fade("Ctrl_PFDDefaultPanelAttitudeBg");
				Fade("Ctrl_PFDDefaultPanelAttitudePitch");
				Fade("Ctrl_PFDDefaultPanelAttitudeRoll");
				Fade("Ctrl_PFDDefaultPanelAttitudeAircraftSymbol");
				if(PFD.Attitude.IsEnabled == true) {
					if((PFD.Attitude.Mode == "Accel" && PFD0.Status.Accel.IsAvailable == true) ||
					PFD.Attitude.Mode == "Manual") {
						Show("Ctrl_PFDDefaultPanelAttitudeBg");
						Show("Ctrl_PFDDefaultPanelAttitudePitch");
						Show("Ctrl_PFDDefaultPanelAttitudeRoll");
						Show("Ctrl_PFDDefaultPanelAttitudeAircraftSymbol");
						if(System.Display.Anim > 0) {
							ChangeAnim("Ctrl_PFDDefaultPanelAttitudeBg", "100ms");
							ChangeAnim("Ctrl_PFDDefaultPanelAttitudePitch", "100ms");
							ChangeAnim("Ctrl_PFDDefaultPanelAttitudeRoll", "100ms");
						} else {
							ChangeAnim("Ctrl_PFDDefaultPanelAttitudeBg", "");
							ChangeAnim("Ctrl_PFDDefaultPanelAttitudePitch", "");
							ChangeAnim("Ctrl_PFDDefaultPanelAttitudeRoll", "");
						}
						ChangeTop("Ctrl_PFDDefaultPanelAttitudeBg", "calc(50% - 2000px + " + 10 * PFD0.Stats.Attitude.Pitch2 * Math.cos(DegToRad(Math.abs(PFD0.Stats.Attitude.Roll))) + "px)");
						ChangeLeft("Ctrl_PFDDefaultPanelAttitudeBg", "calc(50% - 2000px + " + 10 * PFD0.Stats.Attitude.Pitch2 * Math.sin(DegToRad(PFD0.Stats.Attitude.Roll)) + "px)");
						ChangeRotate("Ctrl_PFDDefaultPanelAttitudeBg", -PFD0.Stats.Attitude.Roll);
						ChangeTop("CtrlGroup_PFDDefaultPanelAttitudePitch", "calc(50% - 900px + " + 10 * PFD0.Stats.Attitude.Pitch + "px)");
						ChangeRotate("Ctrl_PFDDefaultPanelAttitudePitch", -PFD0.Stats.Attitude.Roll);
						ChangeRotate("CtrlGroup_PFDDefaultPanelAttitudeRollScale", -PFD0.Stats.Attitude.Roll);
						if(PFD0.Stats.Attitude.Roll <= 0) {
							document.getElementById("ProgringFg_PFDDefaultPanelAttitudeRoll").style.strokeDasharray = (Math.PI * 420) * (-PFD0.Stats.Attitude.Roll / 360) + "px, " + (Math.PI * 420) * (1 + PFD0.Stats.Attitude.Roll / 360) + "px";
						} else {
							document.getElementById("ProgringFg_PFDDefaultPanelAttitudeRoll").style.strokeDasharray = "0, " + (Math.PI * 420) * (1 - PFD0.Stats.Attitude.Roll / 360) + "px, " + (Math.PI * 420) * (PFD0.Stats.Attitude.Roll / 360) + "px";
						}
						if(PFD0.Alert.Active.AttitudeWarning == "BankAngle") {
							AddClass("ProgringFg_PFDDefaultPanelAttitudeRoll", "BankAngleWarning");
							AddClass("PFDDefaultPanelAttitudeRollPointer", "BankAngleWarning");
						} else {
							RemoveClass("ProgringFg_PFDDefaultPanelAttitudeRoll", "BankAngleWarning");
							RemoveClass("PFDDefaultPanelAttitudeRollPointer", "BankAngleWarning");
						}
					} else {
						Show("Ctrl_PFDDefaultPanelAttitudeStatus");
						AddClass("Ctrl_PFDDefaultPanelAttitudeStatus", "OrangeText");
						ChangeText("Label_PFDDefaultPanelAttitudeStatus", Translate("AttitudeUnavailable"));
					}
				} else {
					Show("Ctrl_PFDDefaultPanelAttitudeStatus");
					RemoveClass("Ctrl_PFDDefaultPanelAttitudeStatus", "OrangeText");
					ChangeText("Label_PFDDefaultPanelAttitudeStatus", Translate("AttitudeDisabled"));
				}

				// Speed
				Fade("Ctrl_PFDDefaultPanelSpeedStatus");
				Fade("Ctrl_PFDDefaultPanelSpeedTape");
				Fade("Ctrl_PFDDefaultPanelSpeedAdditionalIndicators");
				Fade("Ctrl_PFDDefaultPanelSpeedBalloon");
				Fade("Ctrl_PFDDefaultPanelMCPSpeed");
				Fade("Ctrl_PFDDefaultPanelMachNumber");
				if((PFD.Speed.Mode == "GPS" && PFD0.Status.GPS.IsSpeedAvailable == true) ||
				(PFD.Speed.Mode == "Accel" && PFD0.Status.Accel.IsAvailable == true) ||
				(PFD.Speed.Mode == "DualChannel" && (PFD0.Status.GPS.IsSpeedAvailable == true || PFD0.Status.Accel.IsAvailable == true)) ||
				PFD.Speed.Mode == "Manual") {
					// Show ctrls
					Show("Ctrl_PFDDefaultPanelSpeedTape");
					Show("Ctrl_PFDDefaultPanelSpeedAdditionalIndicators");
					Show("Ctrl_PFDDefaultPanelSpeedBalloon");
					if(System.Display.Anim > 0) {
						ChangeAnim("Ctrl_PFDDefaultPanelSpeedTape", "100ms");
						ChangeAnim("Ctrl_PFDDefaultPanelSpeedAdditionalIndicators", "100ms");
					} else {
						ChangeAnim("Ctrl_PFDDefaultPanelSpeedTape", "");
						ChangeAnim("Ctrl_PFDDefaultPanelSpeedAdditionalIndicators", "");
					}

					// Tape
					ChangeTop("CtrlGroup_PFDDefaultPanelSpeedTape", "calc(50% - 5000px + " + 5 * ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) + "px)");

					// Additional indicators
						// Speed trend
						if(Math.abs(ConvertUnit(PFD0.Stats.Speed.TrendDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed)) >= 3) {
							Show("Needle_PFDDefaultPanelSpeedTrend");
						} else {
							Fade("Needle_PFDDefaultPanelSpeedTrend");
						}
						ChangeTop("Needle_PFDDefaultPanelSpeedTrend", "calc(50% - " + 5 * Math.abs(ConvertUnit(PFD0.Stats.Speed.TrendDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed)) + "px)");
						ChangeHeight("Needle_PFDDefaultPanelSpeedTrend", 10 * Math.abs(ConvertUnit(PFD0.Stats.Speed.TrendDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed)) + "px");
						if(PFD0.Stats.Speed.TrendDisplay >= 0) {
							RemoveClass("Needle_PFDDefaultPanelSpeedTrend", "Decreasing");
						} else {
							AddClass("Needle_PFDDefaultPanelSpeedTrend", "Decreasing");
						}

						// Other speeds
						ChangeTop("CtrlGroup_PFDDefaultPanelOtherSpeeds", "calc(50% - 5000px + " + 5 * ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) + "px)");
							// Speed limits
							switch(PFD.FlightMode.FlightMode) {
								case "DepartureGround":
								case "ArrivalGround":
									Hide("Ctrl_PFDDefaultPanelSpeedLimitMin");
									break;
								case "TakeOff":
								case "Cruise":
								case "Land":
								case "EmergencyReturn":
									Show("Ctrl_PFDDefaultPanelSpeedLimitMin");
									ChangeHeight("Ctrl_PFDDefaultPanelSpeedLimitMin", 5 * ConvertUnit(PFD0.Stats.Speed.Limit.Min, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) + "px");
									break;
								default:
									AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshDefaultPanel is invalid.");
									break;
							}
							ChangeHeight("Ctrl_PFDDefaultPanelSpeedLimitMax", 5 * (1000 - ConvertUnit(PFD0.Stats.Speed.Limit.Max, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed)) + "px");

							// Avg IAS
							ChangeBottom("Ctrl_PFDDefaultPanelAvgIAS", 5 * ConvertUnit(PFD0.Stats.Speed.AvgIASDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) - 10 + "px");

							// MCP
							if(PFD.MCP.Speed.IsEnabled == true) {
								Show("Ctrl_PFDDefaultPanelMCPSpeedCircle");
								ChangeBottom("Ctrl_PFDDefaultPanelMCPSpeedCircle", 5 * ConvertUnit(PFD.MCP.Speed.IAS, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) - 10 + "px");
							} else {
								Fade("Ctrl_PFDDefaultPanelMCPSpeedCircle");
							}

							// Take off
							switch(PFD.FlightMode.FlightMode) {
								case "DepartureGround":
									Show("Ctrl_PFDDefaultPanelV1");
									Show("Ctrl_PFDDefaultPanelVR");
									ChangeBottom("Ctrl_PFDDefaultPanelV1", 5 * ConvertUnit(PFD.Speed.TakeOff.V1, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) + "px");
									ChangeBottom("Ctrl_PFDDefaultPanelVR", 5 * ConvertUnit(PFD.Speed.TakeOff.VR, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) + "px");
									break;
								case "TakeOff":
								case "Cruise":
								case "Land":
								case "ArrivalGround":
								case "EmergencyReturn":
									Fade("Ctrl_PFDDefaultPanelV1");
									Fade("Ctrl_PFDDefaultPanelVR");
									break;
								default:
									AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshDefaultPanel is invalid.");
									break;
							}

					// Balloon
					ChangeTop("RollingDigit_PFDDefaultPanelSpeed1", -45 * (9 - PFD0.Stats.Speed.BalloonDisplay[1]) + "px");
					ChangeTop("RollingDigit_PFDDefaultPanelSpeed2", -45 * (10 - PFD0.Stats.Speed.BalloonDisplay[2]) + "px");
					switch(true) {
						case ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) < 1:
							ChangeTop("RollingDigit_PFDDefaultPanelSpeed3", 15 - 30 * (18 - PFD0.Stats.Speed.BalloonDisplay[3]) + "px");
							break;
						case ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) > 998:
							ChangeTop("RollingDigit_PFDDefaultPanelSpeed3", 15 - 30 * (9 - PFD0.Stats.Speed.BalloonDisplay[3]) + "px");
							break;
						default:
							ChangeTop("RollingDigit_PFDDefaultPanelSpeed3", 15 - 30 * (14 - PFD0.Stats.Speed.BalloonDisplay[3]) + "px");
							break;
					}
					if(PFD0.Alert.Active.SpeedWarning != "") {
						AddClass("Ctrl_PFDDefaultPanelSpeedBalloonBalloon", "Warning");
					} else {
						RemoveClass("Ctrl_PFDDefaultPanelSpeedBalloonBalloon", "Warning");
					}

					// MCP
					if(PFD.MCP.Speed.IsEnabled == true) {
						Show("Ctrl_PFDDefaultPanelMCPSpeed");
						switch(PFD.MCP.Speed.Mode) {
							case "IAS":
								ChangeText("Label_PFDDefaultPanelMCPSpeed", ConvertUnit(PFD.MCP.Speed.IAS, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed).toFixed(0));
								break;
							case "MachNumber":
								ChangeText("Label_PFDDefaultPanelMCPSpeed", PFD.MCP.Speed.MachNumber.toFixed(3).replace("0.", "."));
								break;
							default:
								AlertSystemError("The value of PFD.MCP.Speed.Mode \"" + PFD.MCP.Speed.Mode + "\" in function RefreshDefaultPanel is invalid.");
								break;
						}
					}

					// Mach number
					if(PFD0.Stats.Speed.MachNumber >= 0.5) {
						Show("Ctrl_PFDDefaultPanelMachNumber");
						ChangeText("Label_PFDDefaultPanelMachNumber", PFD0.Stats.Speed.MachNumber.toFixed(3).replace("0.", "."));
					}
				} else {
					Show("Ctrl_PFDDefaultPanelSpeedStatus");
					ChangeText("Label_PFDDefaultPanelSpeedStatus", Translate("SpeedUnavailable"));
				}

				// Altitude
				Fade("Ctrl_PFDDefaultPanelAltitudeStatus");
				Fade("Ctrl_PFDDefaultPanelAltitudeTape");
				Fade("Ctrl_PFDDefaultPanelAltitudeAdditionalIndicators");
				Fade("Ctrl_PFDDefaultPanelAltitudeBalloon");
				Fade("Ctrl_PFDDefaultPanelMCPAltitude");
				Fade("Ctrl_PFDDefaultPanelMetricAltitude");
				if((PFD.Altitude.Mode == "GPS" && PFD0.Status.GPS.IsAltitudeAvailable == true) ||
				(PFD.Altitude.Mode == "Accel" && PFD0.Status.Accel.IsAvailable == true) ||
				(PFD.Altitude.Mode == "DualChannel" && (PFD0.Status.GPS.IsAltitudeAvailable == true || PFD0.Status.Accel.IsAvailable == true)) ||
				PFD.Altitude.Mode == "Manual") {
					// Show ctrls
					Show("Ctrl_PFDDefaultPanelAltitudeTape");
					Show("Ctrl_PFDDefaultPanelAltitudeAdditionalIndicators");
					Show("Ctrl_PFDDefaultPanelAltitudeBalloon");
					if(System.Display.Anim > 0) {
						ChangeAnim("Ctrl_PFDDefaultPanelAltitudeTape", "100ms");
						ChangeAnim("Ctrl_PFDDefaultPanelAltitudeAdditionalIndicators", "100ms");
					} else {
						ChangeAnim("Ctrl_PFDDefaultPanelAltitudeTape", "");
						ChangeAnim("Ctrl_PFDDefaultPanelAltitudeAdditionalIndicators", "");
					}

					// Tape
					ChangeTop("CtrlGroup_PFDDefaultPanelAltitudeTape", "calc(50% - 37500px + " + 0.75 * ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) + "px)");

					// Additional indicators
						// Altitude trend
						if(Math.abs(ConvertUnit(PFD0.Stats.Altitude.TrendDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude)) >= 20) {
							Show("Needle_PFDDefaultPanelAltitudeTrend");
						} else {
							Fade("Needle_PFDDefaultPanelAltitudeTrend");
						}
						ChangeTop("Needle_PFDDefaultPanelAltitudeTrend", "calc(50% - " + 0.75 * Math.abs(ConvertUnit(PFD0.Stats.Altitude.TrendDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude)) + "px)");
						ChangeHeight("Needle_PFDDefaultPanelAltitudeTrend", 1.5 * Math.abs(ConvertUnit(PFD0.Stats.Altitude.TrendDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude)) + "px");
						if(PFD0.Stats.Altitude.TrendDisplay >= 0) {
							RemoveClass("Needle_PFDDefaultPanelAltitudeTrend", "Decreasing");
						} else {
							AddClass("Needle_PFDDefaultPanelAltitudeTrend", "Decreasing");
						}

						// Other altitudes
						ChangeTop("CtrlGroup_PFDDefaultPanelOtherAltitudes", "calc(50% - 37500px + " + 0.75 * ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) + "px)");
							// Ground altitude
							ChangeBottom("Ctrl_PFDDefaultPanelGroundAltitude", 0.75 * (ConvertUnit(PFD0.Stats.Altitude.Ground, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) + 2000) - 40 + "px");

							// Decision altitude
							switch(PFD.FlightMode.FlightMode) {
								case "DepartureGround":
								case "TakeOff":
								case "Cruise":
									Fade("Ctrl_PFDDefaultPanelDecisionAltitude");
									break;
								case "Land":
								case "ArrivalGround":
								case "EmergencyReturn":
									Show("Ctrl_PFDDefaultPanelDecisionAltitude");
									ChangeBottom("Ctrl_PFDDefaultPanelDecisionAltitude", 0.75 * (ConvertUnit(PFD0.Stats.Altitude.Ground + AirportLibrary0.ActiveAirport.Runway[AirportLibrary0.ActiveAirport.RunwaySelection].DecisionHeight, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) + 2000) - 10 + "px");
									if(PFD0.Status.IsDecisionAltitudeActive == true) {
										AddClass("Ctrl_PFDDefaultPanelDecisionAltitude", "Active");
									} else {
										RemoveClass("Ctrl_PFDDefaultPanelDecisionAltitude", "Active");
									}
									break;
								default:
									AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshDefaultPanel is invalid.");
									break;
							}

							// MCP
							if(PFD.MCP.Altitude.IsEnabled == true) {
								Show("Ctrl_PFDDefaultPanelMCPAltitudeCircle");
								ChangeBottom("Ctrl_PFDDefaultPanelMCPAltitudeCircle", 0.75 * (ConvertUnit(PFD.MCP.Altitude.Value, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) + 2000) - 10 + "px");
							} else {
								Fade("Ctrl_PFDDefaultPanelMCPAltitudeCircle");
							}

					// Balloon
					if(PFD0.Stats.Altitude.TapeDisplay >= 0) {
						ChangeTop("RollingDigit_PFDDefaultPanelAltitude1", -45 * (5 - PFD0.Stats.Altitude.BalloonDisplay[1]) + "px");
					} else {
						ChangeTop("RollingDigit_PFDDefaultPanelAltitude1", "-270px");
					}
					ChangeTop("RollingDigit_PFDDefaultPanelAltitude2", -45 * (10 - PFD0.Stats.Altitude.BalloonDisplay[2]) + "px");
					ChangeTop("RollingDigit_PFDDefaultPanelAltitude3", -45 * (10 - PFD0.Stats.Altitude.BalloonDisplay[3]) + "px");
					switch(true) {
						case ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) < -1980:
							ChangeTop("RollingDigit_PFDDefaultPanelAltitude4", 17.5 - 25 * (21 - PFD0.Stats.Altitude.BalloonDisplay[4] / 20) + "px");
							break;
						case ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) >= -1980 &&
						ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) <= -20:
							ChangeTop("RollingDigit_PFDDefaultPanelAltitude4", 17.5 - 25 * (17 - PFD0.Stats.Altitude.BalloonDisplay[4] / 20) + "px");
							break;
						case ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) > -20 &&
						ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) < 20:
							ChangeTop("RollingDigit_PFDDefaultPanelAltitude4", 17.5 - 25 * (13 - PFD0.Stats.Altitude.BalloonDisplay[4] / 20) + "px");
							break;
						case ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) >= 20 &&
						ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) <= 49980:
							ChangeTop("RollingDigit_PFDDefaultPanelAltitude4", 17.5 - 25 * (9 - PFD0.Stats.Altitude.BalloonDisplay[4] / 20) + "px");
							break;
						case ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) > 49980:
							ChangeTop("RollingDigit_PFDDefaultPanelAltitude4", 17.5 - 25 * (5 - PFD0.Stats.Altitude.BalloonDisplay[4] / 20) + "px");
							break;
						default:
							AlertSystemError("The value of ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, \"Meter\", Subsystem.I18n.MeasurementUnit.Altitude) \"" + ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) + "\" in function RefreshDefaultPanel is invalid.");
							break;
					}
					if(PFD0.Stats.ClockTime - PFD0.Stats.Altitude.BeepTimestamp < 10000 && PFD0.Alert.Active.AltitudeWarning == "") {
						AddClass("Ctrl_PFDDefaultPanelAltitudeBalloonBalloon", "Reminder");
					} else {
						RemoveClass("Ctrl_PFDDefaultPanelAltitudeBalloonBalloon", "Reminder");
					}
					if(PFD0.Alert.Active.AltitudeWarning != "" && PFD0.Alert.Active.AltitudeWarning != "GlideSlope") {
						AddClass("Ctrl_PFDDefaultPanelAltitudeBalloonBalloon", "Warning");
					} else {
						RemoveClass("Ctrl_PFDDefaultPanelAltitudeBalloonBalloon", "Warning");
					}

					// MCP
					if(PFD.MCP.Altitude.IsEnabled == true) {
						Show("Ctrl_PFDDefaultPanelMCPAltitude");
						ChangeText("Label_PFDDefaultPanelMCPAltitude", Math.trunc(ConvertUnit(PFD.MCP.Altitude.Value, "Meter", Subsystem.I18n.MeasurementUnit.Altitude).toFixed(0) / 100) +
							"<span class=\"SmallerText\">" + Math.abs(ConvertUnit(PFD.MCP.Altitude.Value, "Meter", Subsystem.I18n.MeasurementUnit.Altitude).toFixed(0) % 100).toString().padStart(2, "0") + "</span>");
					}

					// Metric
					switch(Subsystem.I18n.MeasurementUnit.Altitude) {
						case "Meter":
						case "Foot":
							break;
						case "FootButShowMeterBeside":
							Show("Ctrl_PFDDefaultPanelMetricAltitude");
							ChangeText("Label_PFDDefaultPanelMetricAltitude", PFD0.Stats.Altitude.TapeDisplay.toFixed(0) + "<span class=\"SmallerText\">" + Translate("MeterOnPFD") + "</span>");
							break;
						default:
							AlertSystemError("The value of Subsystem.I18n.MeasurementUnit.Altitude \"" + Subsystem.I18n.MeasurementUnit.Altitude + "\" in function RefreshDefaultPanel is invalid.");
							break;
					}
				} else {
					Show("Ctrl_PFDDefaultPanelAltitudeStatus");
					ChangeText("Label_PFDDefaultPanelAltitudeStatus", Translate("AltitudeUnavailable"));
				}

				// Vertical speed
				Fade("Ctrl_PFDDefaultPanelVerticalSpeedStatus");
				Fade("Ctrl_PFDDefaultPanelVerticalSpeedTape");
				Fade("Ctrl_PFDDefaultPanelVerticalSpeedAdditionalIndicators");
				Fade("Ctrl_PFDDefaultPanelVerticalSpeedNeedle");
				Fade("Ctrl_PFDDefaultPanelVerticalSpeedBalloon");
				Fade("Ctrl_PFDDefaultPanelMCPVerticalSpeed");
				if((PFD.Altitude.Mode == "GPS" && PFD0.Status.GPS.IsAltitudeAvailable == true) ||
				(PFD.Altitude.Mode == "Accel" && PFD0.Status.Accel.IsAvailable == true) ||
				(PFD.Altitude.Mode == "DualChannel" && (PFD0.Status.GPS.IsAltitudeAvailable == true || PFD0.Status.Accel.IsAvailable == true)) ||
				PFD.Altitude.Mode == "Manual") {
					// Show ctrls
					Show("Ctrl_PFDDefaultPanelVerticalSpeedTape");
					Show("Ctrl_PFDDefaultPanelVerticalSpeedAdditionalIndicators");
					Show("Ctrl_PFDDefaultPanelVerticalSpeedNeedle");
					if(System.Display.Anim > 0) {
						ChangeAnim("Ctrl_PFDDefaultPanelVerticalSpeedNeedle", "100ms");
					} else {
						ChangeAnim("Ctrl_PFDDefaultPanelVerticalSpeedNeedle", "");
					}

					// Additional indicators
						// Other vertical speeds
							// MCP
							if(PFD.MCP.VerticalSpeed.IsEnabled == true) {
								Show("Ctrl_PFDDefaultPanelMCPVerticalSpeedCircle");
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
												AlertSystemError("The value of ConvertedVerticalSpeed \"" + ConvertedVerticalSpeed + "\" in function RefreshDefaultPanel is invalid.");
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
												AlertSystemError("The value of ConvertedVerticalSpeed \"" + ConvertedVerticalSpeed + "\" in function RefreshDefaultPanel is invalid.");
												break;
										}
										break;
									default:
										AlertSystemError("The value of Subsystem.I18n.MeasurementUnit.VerticalSpeed \"" + Subsystem.I18n.MeasurementUnit.VerticalSpeed + "\" in function RefreshDefaultPanel is invalid.");
										break;
								}
								ChangeBottom("Ctrl_PFDDefaultPanelMCPVerticalSpeedCircle", 170 + VerticalPixels + "px");
							} else {
								Fade("Ctrl_PFDDefaultPanelMCPVerticalSpeedCircle");
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
										AlertSystemError("The value of ConvertedVerticalSpeed \"" + ConvertedVerticalSpeed + "\" in function RefreshDefaultPanel is invalid.");
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
										AlertSystemError("The value of ConvertedVerticalSpeed \"" + ConvertedVerticalSpeed + "\" in function RefreshDefaultPanel is invalid.");
										break;
								}
								break;
							default:
								AlertSystemError("The value of Subsystem.I18n.MeasurementUnit.VerticalSpeed \"" + Subsystem.I18n.MeasurementUnit.VerticalSpeed + "\" in function RefreshDefaultPanel is invalid.");
								break;
						}
						NeedleAngle = RadToDeg(Math.atan(VerticalPixels / 100));

						// Refresh needle
						let NeedleLength = 100 / Math.cos(DegToRad(NeedleAngle));
						ChangeRotate("Needle_PFDDefaultPanelVerticalSpeed", -90 + NeedleAngle);
						ChangeTop("Needle_PFDDefaultPanelVerticalSpeed", "calc(50% - " + NeedleLength + "px)");
						ChangeHeight("Needle_PFDDefaultPanelVerticalSpeed", NeedleLength * 2 + "px");

					// Balloon
					if((Subsystem.I18n.MeasurementUnit.VerticalSpeed == "MeterPerSec" && Math.abs(ConvertedVerticalSpeed) >= 1) ||
					(Subsystem.I18n.MeasurementUnit.VerticalSpeed == "FeetPerMin" && Math.abs(ConvertedVerticalSpeed) >= 400)) {
						Show("Ctrl_PFDDefaultPanelVerticalSpeedBalloon");
						let VerticalSpeedDisplay = 0;
						switch(Subsystem.I18n.MeasurementUnit.VerticalSpeed) {
							case "MeterPerSec":
								VerticalSpeedDisplay = CheckRangeAndCorrect(Math.trunc(ConvertedVerticalSpeed / 0.2) * 0.2, -50, 50);
								if(VerticalSpeedDisplay >= 0) {
									ChangeText("Label_PFDDefaultPanelVerticalSpeedBalloon", "+" + VerticalSpeedDisplay.toFixed(1));
								} else {
									ChangeText("Label_PFDDefaultPanelVerticalSpeedBalloon", VerticalSpeedDisplay.toFixed(1));
								}
								break;
							case "FeetPerMin":
								VerticalSpeedDisplay = CheckRangeAndCorrect(Math.trunc(ConvertedVerticalSpeed / 50) * 50, -9999, 9999);
								if(VerticalSpeedDisplay >= 0) {
									ChangeText("Label_PFDDefaultPanelVerticalSpeedBalloon", "+" + VerticalSpeedDisplay);
								} else {
									ChangeText("Label_PFDDefaultPanelVerticalSpeedBalloon", VerticalSpeedDisplay);
								}
								break;
							default:
								AlertSystemError("The value of Subsystem.I18n.MeasurementUnit.VerticalSpeed \"" + Subsystem.I18n.MeasurementUnit.VerticalSpeed + "\" in function RefreshDefaultPanel is invalid.");
								break;
						}
					}

					// MCP
					if(PFD.MCP.VerticalSpeed.IsEnabled == true) {
						Show("Ctrl_PFDDefaultPanelMCPVerticalSpeed");
						ConvertedVerticalSpeed = ConvertUnit(PFD.MCP.VerticalSpeed.Value, "MeterPerSec", Subsystem.I18n.MeasurementUnit.VerticalSpeed);
						switch(Subsystem.I18n.MeasurementUnit.VerticalSpeed) {
							case "MeterPerSec":
								if(ConvertedVerticalSpeed >= 0) {
									ChangeText("Label_PFDDefaultPanelMCPVerticalSpeed", "+" + ConvertedVerticalSpeed.toFixed(1));
								} else {
									ChangeText("Label_PFDDefaultPanelMCPVerticalSpeed", ConvertedVerticalSpeed.toFixed(1));
								}
								break;
							case "FeetPerMin":
								if(ConvertedVerticalSpeed >= 0) {
									ChangeText("Label_PFDDefaultPanelMCPVerticalSpeed", "+" + ConvertedVerticalSpeed.toFixed(0));
								} else {
									ChangeText("Label_PFDDefaultPanelMCPVerticalSpeed", ConvertedVerticalSpeed.toFixed(0));
								}
								break;
							default:
								AlertSystemError("The value of Subsystem.I18n.MeasurementUnit.VerticalSpeed \"" + Subsystem.I18n.MeasurementUnit.VerticalSpeed + "\" in function RefreshDefaultPanel is invalid.");
								break;
						}
					}
				} else {
					Show("Ctrl_PFDDefaultPanelVerticalSpeedStatus");
					ChangeText("Label_PFDDefaultPanelVerticalSpeedStatus", Translate("VerticalSpeedUnavailable"));
				}

				// Heading
				Fade("Ctrl_PFDDefaultPanelHeadingStatus");
				Fade("Ctrl_PFDDefaultPanelHeadingTape");
				Fade("Ctrl_PFDDefaultPanelHeadingAdditionalIndicators");
				Fade("Ctrl_PFDDefaultPanelHeadingBalloon");
				Fade("Ctrl_PFDDefaultPanelMCPHeading");
				if((PFD.Heading.Mode == "GPS" && PFD0.Status.GPS.IsHeadingAvailable == true) ||
				PFD.Heading.Mode == "Manual") {
					Show("Ctrl_PFDDefaultPanelHeadingTape");
					Show("Ctrl_PFDDefaultPanelHeadingAdditionalIndicators");
					Show("Ctrl_PFDDefaultPanelHeadingBalloon");
					if(System.Display.Anim > 0) {
						ChangeAnim("Ctrl_PFDDefaultPanelHeadingTape", "100ms");
						ChangeAnim("Ctrl_PFDDefaultPanelHeadingAdditionalIndicators", "100ms");
					} else {
						ChangeAnim("Ctrl_PFDDefaultPanelHeadingTape", "");
						ChangeAnim("Ctrl_PFDDefaultPanelHeadingAdditionalIndicators", "");
					}
					ChangeRotate("CtrlGroup_PFDDefaultPanelHeadingTape", -PFD0.Stats.Heading.Display);
					if(PFD.Nav.IsEnabled == true && PFD0.Status.GPS.IsPositionAvailable == true) {
						Show("Ctrl_PFDDefaultPanelBearing");
						ChangeRotate("Ctrl_PFDDefaultPanelBearing", PFD0.Stats.Nav.Bearing - PFD0.Stats.Heading.Display);
					} else {
						Fade("Ctrl_PFDDefaultPanelBearing");
					}
					if(PFD.MCP.Heading.IsEnabled == true) {
						Show("Ctrl_PFDDefaultPanelMCPHeadingCircle");
						ChangeRotate("Ctrl_PFDDefaultPanelMCPHeadingCircle", PFD.MCP.Heading.Value - PFD0.Stats.Heading.Display);
					} else {
						Fade("Ctrl_PFDDefaultPanelMCPHeadingCircle");
					}
					ChangeText("Label_PFDDefaultPanelHeadingBalloon", PFD0.Stats.Heading.Display.toFixed(0).toString().padStart(3, "0"));
					if(PFD.MCP.Heading.IsEnabled == true) {
						Show("Ctrl_PFDDefaultPanelMCPHeading");
						ChangeText("Label_PFDDefaultPanelMCPHeading", PFD.MCP.Heading.Value.toFixed(0).toString().padStart(3, "0"));
					}
				} else {
					Show("Ctrl_PFDDefaultPanelHeadingStatus");
					ChangeText("Label_PFDDefaultPanelHeadingStatus", Translate("HeadingUnavailable"));
				}

				// DME
				if(PFD.Nav.IsEnabled == true && PFD0.Status.GPS.IsPositionAvailable == true) {
					Show("Ctnr_PFDDefaultPanelDME");
					ChangeText("Label_PFDDefaultPanelDMERunway", Translate("Runway") + " " + AirportLibrary0.ActiveRunwayName);
					if(PFD0.Stats.Nav.Distance < 10000000) { // Max 10000 kilometers.
						ChangeText("Label_PFDDefaultPanelDMEDistance", ConvertUnit(PFD0.Stats.Nav.Distance, "Meter", Subsystem.I18n.MeasurementUnit.Distance).toFixed(1) + "<span class=\"SmallerText\">" + Translate(Subsystem.I18n.MeasurementUnit.Distance + "OnPFD") + "</span>");
						if(PFD0.Stats.Speed.GSDisplay > 0 && PFD0.Stats.Nav.ETA < 360000000) { // Max 100 hours.
							ChangeText("Label_PFDDefaultPanelDMEETA",
								Math.trunc(PFD0.Stats.Nav.ETA / 3600000) + "<span class=\"SmallerText\">" + Translate("Hour") + "</span>" +
								Math.trunc(PFD0.Stats.Nav.ETA % 3600000 / 60000).toString().padStart(2, "0") + "<span class=\"SmallerText\">" + Translate("Minute") + "</span>");
						} else {
							ChangeText("Label_PFDDefaultPanelDMEETA", "--<span class=\"SmallerText\">" + Translate("Hour") + "</span>--<span class=\"SmallerText\">" + Translate("Minute") + "</span>");
						}
					} else {
						ChangeText("Label_PFDDefaultPanelDMEDistance", Translate("DistanceTooFar"));
						ChangeText("Label_PFDDefaultPanelDMEETA", "--<span class=\"SmallerText\">" + Translate("Hour") + "</span>--<span class=\"SmallerText\">" + Translate("Minute") + "</span>");
					}
				} else {
					Fade("Ctnr_PFDDefaultPanelDME");
				}

				// Localizer
				Fade("Ctnr_PFDDefaultPanelLocalizer");
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
							Show("Ctnr_PFDDefaultPanelLocalizer");
							switch(true) {
								case PFD0.Stats.Nav.LocalizerDeviation <= -2:
									ChangeLeft("PFDDefaultPanelLocalizerPointer", 237.5 + "px");
									break;
								case PFD0.Stats.Nav.LocalizerDeviation > -2 && PFD0.Stats.Nav.LocalizerDeviation < 2:
									ChangeLeft("PFDDefaultPanelLocalizerPointer", 117.5 - 120 * (PFD0.Stats.Nav.LocalizerDeviation / 2) + "px");
									break;
								case PFD0.Stats.Nav.LocalizerDeviation >= 2:
									ChangeLeft("PFDDefaultPanelLocalizerPointer", -2.5 + "px");
									break;
								default:
									AlertSystemError("The value of PFD0.Stats.Nav.LocalizerDeviation \"" + PFD0.Stats.Nav.LocalizerDeviation + "\" in function RefreshDefaultPanel is invalid.");
									break;
							}
							if(System.Display.Anim > 0) {
								ChangeAnim("PFDDefaultPanelLocalizerPointer", "100ms");
							} else {
								ChangeAnim("PFDDefaultPanelLocalizerPointer", "");
							}
							break;
						default:
							AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshDefaultPanel is invalid.");
							break;
					}
				}

				// Glide slope
				Fade("Ctnr_PFDDefaultPanelGlideSlope");
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
							Show("Ctnr_PFDDefaultPanelGlideSlope");
							switch(true) {
								case PFD0.Stats.Nav.GlideSlopeDeviation <= -0.7:
									ChangeTop("PFDDefaultPanelGlideSlopePointer", -2.5 + "px");
									break;
								case PFD0.Stats.Nav.GlideSlopeDeviation > -0.7 && PFD0.Stats.Nav.GlideSlopeDeviation < 0.7:
									ChangeTop("PFDDefaultPanelGlideSlopePointer", 117.5 + 120 * (PFD0.Stats.Nav.GlideSlopeDeviation / 0.7) + "px");
									break;
								case PFD0.Stats.Nav.GlideSlopeDeviation >= 0.7:
									ChangeTop("PFDDefaultPanelGlideSlopePointer", 237.5 + "px");
									break;
								default:
									AlertSystemError("The value of PFD0.Stats.Nav.GlideSlopeDeviation \"" + PFD0.Stats.Nav.GlideSlopeDeviation + "\" in function RefreshDefaultPanel is invalid.");
									break;
							}
							if(System.Display.Anim > 0) {
								ChangeAnim("PFDDefaultPanelGlideSlopePointer", "100ms");
							} else {
								ChangeAnim("PFDDefaultPanelGlideSlopePointer", "");
							}
							if(PFD0.Alert.Active.AltitudeWarning == "GlideSlope") {
								AddClass("PFDDefaultPanelGlideSlopePointer", "GlideSlopeWarning");
							} else {
								RemoveClass("PFDDefaultPanelGlideSlopePointer", "GlideSlopeWarning");
							}
							break;
						default:
							AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshDefaultPanel is invalid.");
							break;
					}
				}

				// Marker beacon
				Fade("Ctnr_PFDDefaultPanelMarkerBeacon");
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
									Show("Ctnr_PFDDefaultPanelMarkerBeacon");
									ChangeMarkerBeacon(PFD0.Stats.Nav.MarkerBeacon);
									ChangeText("Label_PFDDefaultPanelMarkerBeacon", Translate(PFD0.Stats.Nav.MarkerBeacon));
									break;
								default:
									AlertSystemError("The value of PFD0.Stats.Nav.MarkerBeacon \"" + PFD0.Stats.Nav.MarkerBeacon + "\" in function RefreshDefaultPanel is invalid.");
									break;
							}
							break;
						default:
							AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshDefaultPanel is invalid.");
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
					Show("Ctnr_PFDDefaultPanelRadioAltitude");
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
									AlertSystemError("The value of Subsystem.I18n.MeasurementUnit.Altitude \"" + Subsystem.I18n.MeasurementUnit.Altitude + "\" in function RefreshDefaultPanel is invalid.");
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
									AlertSystemError("The value of Subsystem.I18n.MeasurementUnit.Altitude \"" + Subsystem.I18n.MeasurementUnit.Altitude + "\" in function RefreshDefaultPanel is invalid.");
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
									AlertSystemError("The value of Subsystem.I18n.MeasurementUnit.Altitude \"" + Subsystem.I18n.MeasurementUnit.Altitude + "\" in function RefreshDefaultPanel is invalid.");
									break;
							}
							break;
						default:
							AlertSystemError("The value of Math.abs(ConvertedRadioAltitude) \"" + Math.abs(ConvertedRadioAltitude) + "\" in function RefreshDefaultPanel is invalid.");
							break;
					}
					ChangeText("ProgringText_PFDDefaultPanelRadioAltitude", ConvertedRadioAltitudeDisplay);
					Fade("CtrlGroup_PFDDefaultPanelRadioAltitudeDialScale");
					Fade("Progring_PFDDefaultPanelRadioAltitude");
					if(ConvertedRadioAltitudeDisplay > -100 && ConvertedRadioAltitudeDisplay < 1000) {
						Show("CtrlGroup_PFDDefaultPanelRadioAltitudeDialScale");
						if(ConvertedRadioAltitude >= 0) {
							Show("Progring_PFDDefaultPanelRadioAltitude");
							document.getElementById("ProgringFg_PFDDefaultPanelRadioAltitude").style.strokeDasharray = (Math.PI * 82) * (ConvertedRadioAltitude / 1000) + "px, " + (Math.PI * 82) * (1 - ConvertedRadioAltitude / 1000) + "px";
							if(System.Display.Anim > 0) {
								ChangeAnim("ProgringFg_PFDDefaultPanelRadioAltitude", "100ms");
							} else {
								ChangeAnim("ProgringFg_PFDDefaultPanelRadioAltitude", "");
							}
						}
					}
				} else {
					Fade("Ctnr_PFDDefaultPanelRadioAltitude");
				}

				// Decision altitude
				Fade("Ctnr_PFDDefaultPanelDecisionAltitude");
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
							Show("Ctnr_PFDDefaultPanelDecisionAltitude");
							ChangeText("Label_PFDDefaultPanelDecisionAltitudeValue", Math.trunc(ConvertUnit(PFD0.Stats.Altitude.Ground + AirportLibrary0.ActiveAirport.Runway[AirportLibrary0.ActiveAirport.RunwaySelection].DecisionHeight, "Meter", Subsystem.I18n.MeasurementUnit.Altitude)));
							if(PFD0.Status.IsDecisionAltitudeActive == true) {
								AddClass("Ctnr_PFDDefaultPanelDecisionAltitude", "Active");
								if(PFD0.Stats.ClockTime - PFD0.Stats.Altitude.DecisionTimestamp < 3000) {
									AddClass("Ctnr_PFDDefaultPanelDecisionAltitude", "Caution");
								} else {
									RemoveClass("Ctnr_PFDDefaultPanelDecisionAltitude", "Caution");
								}
							} else {
								RemoveClass("Ctnr_PFDDefaultPanelDecisionAltitude", "Active");
								RemoveClass("Ctnr_PFDDefaultPanelDecisionAltitude", "Caution");
							}
							break;
						default:
							AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshDefaultPanel is invalid.");
							break;
					}
				}

				// Warning
				Fade("Ctnr_PFDDefaultPanelWarning");
				if(PFD0.Alert.Active.AttitudeWarning != "") {
					Show("Ctnr_PFDDefaultPanelWarning");
					ChangeText("Label_PFDDefaultPanelWarning", Translate(PFD0.Alert.Active.AttitudeWarning));
				}
				if(PFD0.Alert.Active.SpeedWarning != "") {
					Show("Ctnr_PFDDefaultPanelWarning");
					ChangeText("Label_PFDDefaultPanelWarning", Translate(PFD0.Alert.Active.SpeedWarning));
				}
				if(PFD0.Alert.Active.AltitudeWarning != "") {
					Show("Ctnr_PFDDefaultPanelWarning");
					ChangeText("Label_PFDDefaultPanelWarning", Translate(PFD0.Alert.Active.AltitudeWarning));
				}
			}
