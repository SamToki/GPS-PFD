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
			function RefreshHUDPanel() {
				// Hardware status
				if(PFD0.Status.GPS.IsPositionAvailable == true) {
					if(PFD0.Status.GPS.IsPositionAccurate == true && PFD0.Status.GPS.IsAltitudeAvailable == true && PFD0.Status.GPS.IsAltitudeAccurate == true) {
						ChangeText("Label_PFDHUDPanelGPSValue", Translate("Normal"));
					} else {
						ChangeText("Label_PFDHUDPanelGPSValue", Translate("SignalWeak"));
					}
				} else {
					ChangeText("Label_PFDHUDPanelGPSValue", Translate("Unavailable"));
				}
				if(PFD0.Status.IsAccelAvailable == true) {
					ChangeText("Label_PFDHUDPanelAccelValue", Translate("Normal"));
				} else {
					ChangeText("Label_PFDHUDPanelAccelValue", Translate("Unavailable"));
				}

				// FMA
				ChangeText("Label_PFDHUDPanelSpeedModeValue", Translate(PFD.Speed.Mode));
				ChangeText("Label_PFDHUDPanelAltitudeModeValue", Translate(PFD.Altitude.Mode));
				ChangeText("Label_PFDHUDPanelHeadingModeValue", Translate(PFD.Heading.Mode));
				ChangeText("Label_PFDHUDPanelFlightMode", Translate(PFD.FlightMode.FlightMode));
				if(PFD0.Stats.ClockTime - PFD0.Stats.FlightModeTimestamp < 10000) {
					AddClass("Ctnr_PFDHUDPanelFMA2", "Reminder");
				} else {
					RemoveClass("Ctnr_PFDHUDPanelFMA2", "Reminder");
				}

				// Attitude
				Fade("Ctrl_PFDHUDPanelAttitudeStatus");
				Fade("Ctrl_PFDHUDPanelAttitudePitch");
				Fade("Ctrl_PFDHUDPanelAttitudeRoll");
				Fade("Ctrl_PFDHUDPanelAttitudeAircraftSymbol");
				if(PFD.Attitude.IsEnabled == true) {
					if((PFD.Attitude.Mode == "Accel" && PFD0.Status.IsAccelAvailable == true) ||
					PFD.Attitude.Mode == "Manual") {
						Show("Ctrl_PFDHUDPanelAttitudePitch");
						Show("Ctrl_PFDHUDPanelAttitudeRoll");
						Show("Ctrl_PFDHUDPanelAttitudeAircraftSymbol");
						if(System.Display.Anim > 0) {
							ChangeAnim("Ctrl_PFDHUDPanelAttitudePitch", "100ms");
							ChangeAnim("Ctrl_PFDHUDPanelAttitudeRoll", "100ms");
						} else {
							ChangeAnim("Ctrl_PFDHUDPanelAttitudePitch", "");
							ChangeAnim("Ctrl_PFDHUDPanelAttitudeRoll", "");
						}
						ChangeTop("CtrlGroup_PFDHUDPanelAttitudePitch", "calc(50% - 1800px + " + 20 * PFD0.Stats.Attitude.Pitch + "px)");
						ChangeRotate("Ctrl_PFDHUDPanelAttitudePitch", -PFD0.Stats.Attitude.Roll);
						ChangeRotate("CtrlGroup_PFDHUDPanelAttitudeRollScale", -PFD0.Stats.Attitude.Roll);
						if(PFD0.Stats.Attitude.Roll <= 0) {
							document.getElementById("ProgringFg_PFDHUDPanelAttitudeRoll").style.strokeDasharray = (Math.PI * 620) * (-PFD0.Stats.Attitude.Roll / 360) + "px, " + (Math.PI * 620) * (1 + PFD0.Stats.Attitude.Roll / 360) + "px";
						} else {
							document.getElementById("ProgringFg_PFDHUDPanelAttitudeRoll").style.strokeDasharray = "0, " + (Math.PI * 620) * (1 - PFD0.Stats.Attitude.Roll / 360) + "px, " + (Math.PI * 620) * (PFD0.Stats.Attitude.Roll / 360) + "px";
						}
						if(PFD0.Alert.Active.AttitudeWarning == "BankAngle") {
							AddClass("PFDHUDPanelAttitudeRollScaleInner", "BankAngleWarning");
							AddClass("PFDHUDPanelAttitudeRollPointerInner", "BankAngleWarning");
						} else {
							RemoveClass("PFDHUDPanelAttitudeRollScaleInner", "BankAngleWarning");
							RemoveClass("PFDHUDPanelAttitudeRollPointerInner", "BankAngleWarning");
						}
					} else {
						Show("Ctrl_PFDHUDPanelAttitudeStatus");
						ChangeText("Label_PFDHUDPanelAttitudeStatus", Translate("AttitudeUnavailable"));
					}
				} else {
					Show("Ctrl_PFDHUDPanelAttitudeStatus");
					ChangeText("Label_PFDHUDPanelAttitudeStatus", Translate("AttitudeDisabled"));
				}

				// Speed
				Fade("Ctrl_PFDHUDPanelSpeedStatus");
				Fade("Ctrl_PFDHUDPanelSpeedTape");
				Fade("Ctrl_PFDHUDPanelSpeedAdditionalIndicators");
				Fade("Ctrl_PFDHUDPanelSpeedBalloon");
				Fade("Ctrl_PFDHUDPanelMCPSpeed");
				Fade("Ctrl_PFDHUDPanelMachNumber");
				Fade("Ctrl_PFDHUDPanelSpeedGS");
				if((PFD.Speed.Mode == "GPS" && PFD0.Status.GPS.IsSpeedAvailable == true) ||
				(PFD.Speed.Mode == "Accel" && PFD0.Status.IsAccelAvailable == true) ||
				(PFD.Speed.Mode == "DualChannel" && (PFD0.Status.GPS.IsSpeedAvailable == true || PFD0.Status.IsAccelAvailable == true)) ||
				PFD.Speed.Mode == "Manual") {
					// Show ctrls
					Show("Ctrl_PFDHUDPanelSpeedTape");
					Show("Ctrl_PFDHUDPanelSpeedAdditionalIndicators");
					Show("Ctrl_PFDHUDPanelSpeedBalloon");
					Show("Ctrl_PFDHUDPanelSpeedGS");
					if(System.Display.Anim > 0) {
						ChangeAnim("Ctrl_PFDHUDPanelSpeedTape", "100ms");
						ChangeAnim("Ctrl_PFDHUDPanelSpeedAdditionalIndicators", "100ms");
					} else {
						ChangeAnim("Ctrl_PFDHUDPanelSpeedTape", "");
						ChangeAnim("Ctrl_PFDHUDPanelSpeedAdditionalIndicators", "");
					}

					// Tape
					ChangeTop("CtrlGroup_PFDHUDPanelSpeedTape", "calc(50% - 5000px + " + 5 * ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.SpeedUnit) + "px)");

					// Additional indicators
						// Speed trend
						if(Math.abs(ConvertUnit(PFD0.Stats.Speed.TrendDisplay, "MeterPerSec", Subsystem.I18n.SpeedUnit)) >= 3) {
							Show("Needle_PFDHUDPanelSpeedTrend");
						} else {
							Fade("Needle_PFDHUDPanelSpeedTrend");
						}
						ChangeTop("Needle_PFDHUDPanelSpeedTrend", "calc(50% - " + 5 * Math.abs(ConvertUnit(PFD0.Stats.Speed.TrendDisplay, "MeterPerSec", Subsystem.I18n.SpeedUnit)) + "px)");
						ChangeHeight("Needle_PFDHUDPanelSpeedTrend", 10 * Math.abs(ConvertUnit(PFD0.Stats.Speed.TrendDisplay, "MeterPerSec", Subsystem.I18n.SpeedUnit)) + "px");
						if(PFD0.Stats.Speed.TrendDisplay >= 0) {
							RemoveClass("Needle_PFDHUDPanelSpeedTrend", "Decreasing");
						} else {
							AddClass("Needle_PFDHUDPanelSpeedTrend", "Decreasing");
						}

						// Other speeds
						ChangeTop("CtrlGroup_PFDHUDPanelOtherSpeeds", "calc(50% - 5000px + " + 5 * ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.SpeedUnit) + "px)");
							// Speed limits
							switch(PFD.FlightMode.FlightMode) {
								case "DepartureGround":
								case "ArrivalGround":
									Hide("Ctrl_PFDHUDPanelSpeedLimitMin");
									break;
								case "TakeOff":
								case "Cruise":
								case "Land":
								case "EmergencyReturn":
									Show("Ctrl_PFDHUDPanelSpeedLimitMin");
									ChangeHeight("Ctrl_PFDHUDPanelSpeedLimitMin", 5 * ConvertUnit(PFD.Speed.SpeedLimit.Min, "MeterPerSec", Subsystem.I18n.SpeedUnit) + "px");
									break;
								default:
									AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshHUDPanel is invalid.");
									break;
							}
							ChangeHeight("Ctrl_PFDHUDPanelSpeedLimitMax", 5 * (1000 - ConvertUnit(CalcMaxSpeedLimit(PFD.Speed.SpeedLimit.MaxOnFlapsUp, PFD.Speed.SpeedLimit.MaxOnFlapsFull, PFD.Flaps), "MeterPerSec", Subsystem.I18n.SpeedUnit)) + "px");

							// Avg IAS
							ChangeBottom("Ctrl_PFDHUDPanelAvgIAS", 5 * ConvertUnit(PFD0.Stats.Speed.AvgIASDisplay, "MeterPerSec", Subsystem.I18n.SpeedUnit) - 10 + "px");

							// MCP
							if(PFD.MCP.Speed.IsEnabled == true) {
								Show("Ctrl_PFDHUDPanelMCPSpeedCircle");
								ChangeBottom("Ctrl_PFDHUDPanelMCPSpeedCircle", 5 * ConvertUnit(PFD.MCP.Speed.IAS, "MeterPerSec", Subsystem.I18n.SpeedUnit) - 10 + "px");
							} else {
								Fade("Ctrl_PFDHUDPanelMCPSpeedCircle");
							}

							// Take off
							switch(PFD.FlightMode.FlightMode) {
								case "DepartureGround":
									Show("Ctrl_PFDHUDPanelV1");
									Show("Ctrl_PFDHUDPanelVR");
									ChangeBottom("Ctrl_PFDHUDPanelV1", 5 * ConvertUnit(PFD.Speed.TakeOff.V1, "MeterPerSec", Subsystem.I18n.SpeedUnit) + "px");
									ChangeBottom("Ctrl_PFDHUDPanelVR", 5 * ConvertUnit(PFD.Speed.TakeOff.VR, "MeterPerSec", Subsystem.I18n.SpeedUnit) + "px");
									break;
								case "TakeOff":
								case "Cruise":
								case "Land":
								case "ArrivalGround":
								case "EmergencyReturn":
									Fade("Ctrl_PFDHUDPanelV1");
									Fade("Ctrl_PFDHUDPanelVR");
									break;
								default:
									AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshHUDPanel is invalid.");
									break;
							}

					// Balloon
					ChangeTop("RollingDigit_PFDHUDPanelSpeed1", -45 * (9 - PFD0.Stats.Speed.BalloonDisplay[1]) + "px");
					ChangeTop("RollingDigit_PFDHUDPanelSpeed2", -45 * (10 - PFD0.Stats.Speed.BalloonDisplay[2]) + "px");
					switch(true) {
						case ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.SpeedUnit) < 1:
							ChangeTop("RollingDigit_PFDHUDPanelSpeed3", 15 - 30 * (18 - PFD0.Stats.Speed.BalloonDisplay[3]) + "px");
							break;
						case ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.SpeedUnit) > 998:
							ChangeTop("RollingDigit_PFDHUDPanelSpeed3", 15 - 30 * (9 - PFD0.Stats.Speed.BalloonDisplay[3]) + "px");
							break;
						default:
							ChangeTop("RollingDigit_PFDHUDPanelSpeed3", 15 - 30 * (14 - PFD0.Stats.Speed.BalloonDisplay[3]) + "px");
							break;
					}
					if(PFD0.Alert.Active.SpeedWarning != "") {
						AddClass("Ctrl_PFDHUDPanelSpeedBalloonBalloon", "Warning");
					} else {
						RemoveClass("Ctrl_PFDHUDPanelSpeedBalloonBalloon", "Warning");
					}

					// MCP
					if(PFD.MCP.Speed.IsEnabled == true) {
						Show("Ctrl_PFDHUDPanelMCPSpeed");
						switch(PFD.MCP.Speed.Mode) {
							case "IAS":
								ChangeText("Label_PFDHUDPanelMCPSpeed", ConvertUnit(PFD.MCP.Speed.IAS, "MeterPerSec", Subsystem.I18n.SpeedUnit).toFixed(0));
								break;
							case "MachNumber":
								ChangeText("Label_PFDHUDPanelMCPSpeed", PFD.MCP.Speed.MachNumber.toFixed(3).replace("0.", "."));
								break;
							default:
								AlertSystemError("The value of PFD.MCP.Speed.Mode \"" + PFD.MCP.Speed.Mode + "\" in function RefreshHUDPanel is invalid.");
								break;
						}
					}

					// Mach number
					if(PFD0.Stats.Speed.MachNumber >= 0.5) {
						Show("Ctrl_PFDHUDPanelMachNumber");
						ChangeText("Label_PFDHUDPanelMachNumber", PFD0.Stats.Speed.MachNumber.toFixed(3).replace("0.", "."));
					}

					// GS
					ChangeText("Label_PFDHUDPanelSpeedGSValue", ConvertUnit(PFD0.Stats.Speed.GSDisplay, "MeterPerSec", Subsystem.I18n.SpeedUnit).toFixed(0));
				} else {
					Show("Ctrl_PFDHUDPanelSpeedStatus");
					ChangeText("Label_PFDHUDPanelSpeedStatus", Translate("SpeedUnavailable"));
				}

				// Altitude
				Fade("Ctrl_PFDHUDPanelAltitudeStatus");
				Fade("Ctrl_PFDHUDPanelAltitudeTape");
				Fade("Ctrl_PFDHUDPanelAltitudeAdditionalIndicators");
				Fade("Ctrl_PFDHUDPanelAltitudeBalloon");
				Fade("Ctrl_PFDHUDPanelMCPAltitude");
				Fade("Ctrl_PFDHUDPanelMetricAltitude");
				if((PFD.Altitude.Mode == "GPS" && PFD0.Status.GPS.IsAltitudeAvailable == true) ||
				(PFD.Altitude.Mode == "Accel" && PFD0.Status.IsAccelAvailable == true) ||
				(PFD.Altitude.Mode == "DualChannel" && (PFD0.Status.GPS.IsAltitudeAvailable == true || PFD0.Status.IsAccelAvailable == true)) ||
				PFD.Altitude.Mode == "Manual") {
					// Show ctrls
					Show("Ctrl_PFDHUDPanelAltitudeTape");
					Show("Ctrl_PFDHUDPanelAltitudeAdditionalIndicators");
					Show("Ctrl_PFDHUDPanelAltitudeBalloon");
					if(System.Display.Anim > 0) {
						ChangeAnim("Ctrl_PFDHUDPanelAltitudeTape", "100ms");
						ChangeAnim("Ctrl_PFDHUDPanelAltitudeAdditionalIndicators", "100ms");
					} else {
						ChangeAnim("Ctrl_PFDHUDPanelAltitudeTape", "");
						ChangeAnim("Ctrl_PFDHUDPanelAltitudeAdditionalIndicators", "");
					}

					// Tape
					ChangeTop("CtrlGroup_PFDHUDPanelAltitudeTape", "calc(50% - 37500px + " + 0.75 * ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.AltitudeUnit) + "px)");

					// Additional indicators
						// Altitude trend
						if(Math.abs(ConvertUnit(PFD0.Stats.Altitude.TrendDisplay, "Meter", Subsystem.I18n.AltitudeUnit)) >= 20) {
							Show("Needle_PFDHUDPanelAltitudeTrend");
						} else {
							Fade("Needle_PFDHUDPanelAltitudeTrend");
						}
						ChangeTop("Needle_PFDHUDPanelAltitudeTrend", "calc(50% - " + 0.75 * Math.abs(ConvertUnit(PFD0.Stats.Altitude.TrendDisplay, "Meter", Subsystem.I18n.AltitudeUnit)) + "px)");
						ChangeHeight("Needle_PFDHUDPanelAltitudeTrend", 1.5 * Math.abs(ConvertUnit(PFD0.Stats.Altitude.TrendDisplay, "Meter", Subsystem.I18n.AltitudeUnit)) + "px");
						if(PFD0.Stats.Altitude.TrendDisplay >= 0) {
							RemoveClass("Needle_PFDHUDPanelAltitudeTrend", "Decreasing");
						} else {
							AddClass("Needle_PFDHUDPanelAltitudeTrend", "Decreasing");
						}

						// Other altitudes
						ChangeTop("CtrlGroup_PFDHUDPanelOtherAltitudes", "calc(50% - 37500px + " + 0.75 * ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.AltitudeUnit) + "px)");
							// Ground altitude
							switch(PFD.FlightMode.FlightMode) {
								case "DepartureGround":
								case "TakeOff":
								case "EmergencyReturn":
									ChangeBottom("Ctrl_PFDHUDPanelGroundAltitude", 0.75 * (ConvertUnit(PFD.Altitude.AirportElevation.Departure, "Meter", Subsystem.I18n.AltitudeUnit) + 2000) - 40 + "px");
									break;
								case "Cruise":
								case "Land":
								case "ArrivalGround":
									ChangeBottom("Ctrl_PFDHUDPanelGroundAltitude", 0.75 * (ConvertUnit(PFD.Altitude.AirportElevation.Arrival, "Meter", Subsystem.I18n.AltitudeUnit) + 2000) - 40 + "px");
									break;
								default:
									AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshHUDPanel is invalid.");
									break;
							}

							// Decision altitude
							switch(PFD.FlightMode.FlightMode) {
								case "DepartureGround":
								case "TakeOff":
								case "Cruise":
									Fade("Ctrl_PFDHUDPanelDecisionAltitude");
									break;
								case "Land":
								case "ArrivalGround":
									Show("Ctrl_PFDHUDPanelDecisionAltitude");
									ChangeBottom("Ctrl_PFDHUDPanelDecisionAltitude", 0.75 * (ConvertUnit(PFD.Altitude.AirportElevation.Arrival + PFD.Altitude.DecisionHeight, "Meter", Subsystem.I18n.AltitudeUnit) + 2000) - 10 + "px");
									if(PFD0.Status.IsDecisionAltitudeActive == true) {
										AddClass("Ctrl_PFDHUDPanelDecisionAltitude", "Active");
									} else {
										RemoveClass("Ctrl_PFDHUDPanelDecisionAltitude", "Active");
									}
									break;
								case "EmergencyReturn":
									Show("Ctrl_PFDHUDPanelDecisionAltitude");
									ChangeBottom("Ctrl_PFDHUDPanelDecisionAltitude", 0.75 * (ConvertUnit(PFD.Altitude.AirportElevation.Departure + PFD.Altitude.DecisionHeight, "Meter", Subsystem.I18n.AltitudeUnit) + 2000) - 10 + "px");
									if(PFD0.Status.IsDecisionAltitudeActive == true) {
										AddClass("Ctrl_PFDHUDPanelDecisionAltitude", "Active");
									} else {
										RemoveClass("Ctrl_PFDHUDPanelDecisionAltitude", "Active");
									}
									break;
								default:
									AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshHUDPanel is invalid.");
									break;
							}

							// MCP
							if(PFD.MCP.Altitude.IsEnabled == true) {
								Show("Ctrl_PFDHUDPanelMCPAltitudeCircle");
								ChangeBottom("Ctrl_PFDHUDPanelMCPAltitudeCircle", 0.75 * (ConvertUnit(PFD.MCP.Altitude.Value, "Meter", Subsystem.I18n.AltitudeUnit) + 2000) - 10 + "px");
							} else {
								Fade("Ctrl_PFDHUDPanelMCPAltitudeCircle");
							}

					// Balloon
					if(PFD0.Stats.Altitude.TapeDisplay >= 0) {
						ChangeTop("RollingDigit_PFDHUDPanelAltitude1", -45 * (5 - PFD0.Stats.Altitude.BalloonDisplay[1]) + "px");
					} else {
						ChangeTop("RollingDigit_PFDHUDPanelAltitude1", "-270px");
					}
					ChangeTop("RollingDigit_PFDHUDPanelAltitude2", -45 * (10 - PFD0.Stats.Altitude.BalloonDisplay[2]) + "px");
					ChangeTop("RollingDigit_PFDHUDPanelAltitude3", -45 * (10 - PFD0.Stats.Altitude.BalloonDisplay[3]) + "px");
					switch(true) {
						case ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.AltitudeUnit) < -1980:
							ChangeTop("RollingDigit_PFDHUDPanelAltitude4", 17.5 - 25 * (21 - PFD0.Stats.Altitude.BalloonDisplay[4] / 20) + "px");
							break;
						case ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.AltitudeUnit) >= -1980 &&
						ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.AltitudeUnit) <= -20:
							ChangeTop("RollingDigit_PFDHUDPanelAltitude4", 17.5 - 25 * (17 - PFD0.Stats.Altitude.BalloonDisplay[4] / 20) + "px");
							break;
						case ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.AltitudeUnit) > -20 &&
						ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.AltitudeUnit) < 20:
							ChangeTop("RollingDigit_PFDHUDPanelAltitude4", 17.5 - 25 * (13 - PFD0.Stats.Altitude.BalloonDisplay[4] / 20) + "px");
							break;
						case ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.AltitudeUnit) >= 20 &&
						ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.AltitudeUnit) <= 49980:
							ChangeTop("RollingDigit_PFDHUDPanelAltitude4", 17.5 - 25 * (9 - PFD0.Stats.Altitude.BalloonDisplay[4] / 20) + "px");
							break;
						case ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.AltitudeUnit) > 49980:
							ChangeTop("RollingDigit_PFDHUDPanelAltitude4", 17.5 - 25 * (5 - PFD0.Stats.Altitude.BalloonDisplay[4] / 20) + "px");
							break;
						default:
							AlertSystemError("The value of ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, \"Meter\", Subsystem.I18n.AltitudeUnit) \"" + ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.AltitudeUnit) + "\" in function RefreshHUDPanel is invalid.");
							break;
					}
					if(PFD0.Stats.ClockTime - PFD0.Stats.Altitude.BeepTimestamp < 10000 && PFD0.Alert.Active.AltitudeWarning == "") {
						AddClass("Ctrl_PFDHUDPanelAltitudeBalloonBalloon", "Reminder");
					} else {
						RemoveClass("Ctrl_PFDHUDPanelAltitudeBalloonBalloon", "Reminder");
					}
					if(PFD0.Alert.Active.AltitudeWarning != "" && PFD0.Alert.Active.AltitudeWarning != "GlideSlope") {
						AddClass("Ctrl_PFDHUDPanelAltitudeBalloonBalloon", "Warning");
					} else {
						RemoveClass("Ctrl_PFDHUDPanelAltitudeBalloonBalloon", "Warning");
					}

					// MCP
					if(PFD.MCP.Altitude.IsEnabled == true) {
						Show("Ctrl_PFDHUDPanelMCPAltitude");
						ChangeText("Label_PFDHUDPanelMCPAltitude", Math.trunc(ConvertUnit(PFD.MCP.Altitude.Value, "Meter", Subsystem.I18n.AltitudeUnit).toFixed(0) / 100) +
							"<span class=\"SmallerText\">" + Math.abs(ConvertUnit(PFD.MCP.Altitude.Value, "Meter", Subsystem.I18n.AltitudeUnit).toFixed(0) % 100).toString().padStart(2, "0") + "</span>");
					}

					// Metric
					switch(Subsystem.I18n.AltitudeUnit) {
						case "Meter":
						case "Feet":
							break;
						case "FeetButShowMeterBeside":
							Show("Ctrl_PFDHUDPanelMetricAltitude");
							ChangeText("Label_PFDHUDPanelMetricAltitude", PFD0.Stats.Altitude.TapeDisplay.toFixed(0) + "<span class=\"SmallerText\">" + Translate("MetricAltitude") + "</span>");
							break;
						default:
							AlertSystemError("The value of Subsystem.I18n.AltitudeUnit \"" + Subsystem.I18n.AltitudeUnit + "\" in function RefreshHUDPanel is invalid.");
							break;
					}
				} else {
					Show("Ctrl_PFDHUDPanelAltitudeStatus");
					ChangeText("Label_PFDHUDPanelAltitudeStatus", Translate("AltitudeUnavailable"));
				}

				// Heading
				Fade("Ctrl_PFDHUDPanelHeadingStatus");
				Fade("Ctrl_PFDHUDPanelHeadingTape");
				Fade("Ctrl_PFDHUDPanelHeadingAdditionalIndicators");
				Fade("Ctrl_PFDHUDPanelHeadingBalloon");
				Fade("Ctrl_PFDHUDPanelMCPHeading");
				if((PFD.Heading.Mode == "GPS" && PFD0.Status.GPS.IsHeadingAvailable == true) ||
				PFD.Heading.Mode == "Manual") {
					Show("Ctrl_PFDHUDPanelHeadingTape");
					Show("Ctrl_PFDHUDPanelHeadingAdditionalIndicators");
					Show("Ctrl_PFDHUDPanelHeadingBalloon");
					if(System.Display.Anim > 0) {
						ChangeAnim("Ctrl_PFDHUDPanelHeadingTape", "100ms");
						ChangeAnim("Ctrl_PFDHUDPanelHeadingAdditionalIndicators", "100ms");
					} else {
						ChangeAnim("Ctrl_PFDHUDPanelHeadingTape", "");
						ChangeAnim("Ctrl_PFDHUDPanelHeadingAdditionalIndicators", "");
					}
					ChangeRotate("CtrlGroup_PFDHUDPanelHeadingTape", -PFD0.Stats.Heading.Display);
					if(PFD.Nav.IsEnabled == true && PFD0.Status.GPS.IsPositionAvailable == true) {
						Show("Ctrl_PFDHUDPanelBearing");
						ChangeRotate("Ctrl_PFDHUDPanelBearing", PFD0.Stats.Nav.Bearing - PFD0.Stats.Heading.Display);
					} else {
						Fade("Ctrl_PFDHUDPanelBearing");
					}
					if(PFD.MCP.Heading.IsEnabled == true) {
						Show("Ctrl_PFDHUDPanelMCPHeadingCircle");
						ChangeRotate("Ctrl_PFDHUDPanelMCPHeadingCircle", PFD.MCP.Heading.Value - PFD0.Stats.Heading.Display);
					} else {
						Fade("Ctrl_PFDHUDPanelMCPHeadingCircle");
					}
					ChangeText("Label_PFDHUDPanelHeadingBalloon", PFD0.Stats.Heading.Display.toFixed(0).toString().padStart(3, "0"));
					if(PFD.MCP.Heading.IsEnabled == true) {
						Show("Ctrl_PFDHUDPanelMCPHeading");
						ChangeText("Label_PFDHUDPanelMCPHeading", PFD.MCP.Heading.Value.toFixed(0).toString().padStart(3, "0"));
					}
				} else {
					Show("Ctrl_PFDHUDPanelHeadingStatus");
					ChangeText("Label_PFDHUDPanelHeadingStatus", Translate("HeadingUnavailable"));
				}

				// Wind
				if(PFD.Speed.Wind.Speed > 0 &&
				(
					(PFD.Heading.Mode == "GPS" && PFD0.Status.GPS.IsHeadingAvailable == true) ||
					PFD.Heading.Mode == "Manual"
				)) {
					Show("Ctnr_PFDHUDPanelWind");
					ChangeRotate("Needle_PFDHUDPanelWindDirection", PFD0.Stats.Speed.Wind.RelativeHeading);
					ChangeText("Label_PFDHUDPanelWind", ConvertUnit(PFD.Speed.Wind.Speed, "MeterPerSec", Subsystem.I18n.SpeedUnit).toFixed(0));
				} else {
					Fade("Ctnr_PFDHUDPanelWind");
				}

				// Vertical speed
				if((PFD.Altitude.Mode == "GPS" && PFD0.Status.GPS.IsAltitudeAvailable == true) ||
				(PFD.Altitude.Mode == "Accel" && PFD0.Status.IsAccelAvailable == true) ||
				(PFD.Altitude.Mode == "DualChannel" && (PFD0.Status.GPS.IsAltitudeAvailable == true || PFD0.Status.IsAccelAvailable == true)) ||
				PFD.Altitude.Mode == "Manual") {
					let ConvertedVerticalSpeed = 0, VerticalSpeedDisplay = 0;
					ConvertedVerticalSpeed = ConvertUnit(PFD0.Stats.Speed.Vertical, "MeterPerSec", Subsystem.I18n.VerticalSpeedUnit);
					if((Subsystem.I18n.VerticalSpeedUnit == "MeterPerSec" && Math.abs(ConvertedVerticalSpeed) >= 0.2) ||
					(Subsystem.I18n.VerticalSpeedUnit == "FeetPerMin" && Math.abs(ConvertedVerticalSpeed) >= 50)) {
						Show("Ctnr_PFDHUDPanelVerticalSpeed");
						if(ConvertedVerticalSpeed >= 0) {
							RemoveClass("Icon_PFDHUDPanelVerticalSpeed", "Decreasing");
						} else {
							AddClass("Icon_PFDHUDPanelVerticalSpeed", "Decreasing");
						}
						switch(Subsystem.I18n.VerticalSpeedUnit) {
							case "MeterPerSec":
								VerticalSpeedDisplay = CheckRangeAndCorrect(Math.trunc(ConvertedVerticalSpeed / 0.2) * 0.2, -50, 50);
								ChangeText("Label_PFDHUDPanelVerticalSpeed", Math.abs(VerticalSpeedDisplay).toFixed(1));
								break;
							case "FeetPerMin":
								VerticalSpeedDisplay = CheckRangeAndCorrect(Math.trunc(ConvertedVerticalSpeed / 50) * 50, -9999, 9999);
								ChangeText("Label_PFDHUDPanelVerticalSpeed", Math.abs(VerticalSpeedDisplay));
								break;
							default:
								AlertSystemError("The value of Subsystem.I18n.VerticalSpeedUnit \"" + Subsystem.I18n.VerticalSpeedUnit + "\" in function RefreshHUDPanel is invalid.");
								break;
						}
					} else {
						Fade("Ctnr_PFDHUDPanelVerticalSpeed");
					}
				} else {
					Fade("Ctnr_PFDHUDPanelVerticalSpeed");
				}

				// DME
				if(PFD.Nav.IsEnabled == true && PFD0.Status.GPS.IsPositionAvailable == true) {
					Show("Ctnr_PFDHUDPanelDME");
					if(PFD0.Stats.Nav.Distance < 10000000) { // Max 10000 kilometers.
						ChangeText("Label_PFDHUDPanelDMEDistance",
							ConvertUnit(PFD0.Stats.Nav.Distance, "Meter", Subsystem.I18n.DistanceUnit).toFixed(1) + "<span class=\"SmallerText\">" + Translate(Subsystem.I18n.DistanceUnit + "OnPFD") + "</span>");
						if(PFD0.Stats.Speed.GSDisplay > 0 && PFD0.Stats.Nav.ETA < 360000000) { // Max 100 hours.
							ChangeText("Label_PFDHUDPanelDMEETA",
								Math.trunc(PFD0.Stats.Nav.ETA / 3600000) + "<span class=\"SmallerText\">" + Translate("Hour") + "</span>" +
								Math.trunc(PFD0.Stats.Nav.ETA % 3600000 / 60000).toString().padStart(2, "0") + "<span class=\"SmallerText\">" + Translate("Minute") + "</span>");
						} else {
							ChangeText("Label_PFDHUDPanelDMEETA", "--<span class=\"SmallerText\">" + Translate("Hour") + "</span>--<span class=\"SmallerText\">" + Translate("Minute") + "</span>");
						}
					} else {
						ChangeText("Label_PFDHUDPanelDMEDistance", Translate("DistanceTooFar"));
						ChangeText("Label_PFDHUDPanelDMEETA", "--<span class=\"SmallerText\">" + Translate("Hour") + "</span>--<span class=\"SmallerText\">" + Translate("Minute") + "</span>");
					}
				} else {
					Fade("Ctnr_PFDHUDPanelDME");
				}

				// Localizer
				Fade("Ctnr_PFDHUDPanelLocalizer");
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
							Show("Ctnr_PFDHUDPanelLocalizer");
							switch(true) {
								case PFD0.Stats.Nav.LocalizerDeviation <= -2:
									ChangeLeft("PFDHUDPanelLocalizerPointer", 237.5 + "px");
									break;
								case PFD0.Stats.Nav.LocalizerDeviation > -2 && PFD0.Stats.Nav.LocalizerDeviation < 2:
									ChangeLeft("PFDHUDPanelLocalizerPointer", 117.5 - 120 * (PFD0.Stats.Nav.LocalizerDeviation / 2) + "px");
									break;
								case PFD0.Stats.Nav.LocalizerDeviation >= 2:
									ChangeLeft("PFDHUDPanelLocalizerPointer", -2.5 + "px");
									break;
								default:
									AlertSystemError("The value of PFD0.Stats.Nav.LocalizerDeviation \"" + PFD0.Stats.Nav.LocalizerDeviation + "\" in function RefreshHUDPanel is invalid.");
									break;
							}
							if(System.Display.Anim > 0) {
								ChangeAnim("PFDHUDPanelLocalizerPointer", "100ms");
							} else {
								ChangeAnim("PFDHUDPanelLocalizerPointer", "");
							}
							break;
						default:
							AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshHUDPanel is invalid.");
							break;
					}
				}

				// Glide slope
				Fade("Ctnr_PFDHUDPanelGlideSlope");
				if(PFD.Nav.IsEnabled == true &&
				PFD0.Status.GPS.IsPositionAvailable == true &&
				(
					(PFD.Altitude.Mode == "GPS" && PFD0.Status.GPS.IsAltitudeAvailable == true) ||
					(PFD.Altitude.Mode == "Accel" && PFD0.Status.IsAccelAvailable == true) ||
					(PFD.Altitude.Mode == "DualChannel" && (PFD0.Status.GPS.IsAltitudeAvailable == true || PFD0.Status.IsAccelAvailable == true)) ||
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
							Show("Ctnr_PFDHUDPanelGlideSlope");
							switch(true) {
								case PFD0.Stats.Nav.GlideSlopeDeviation <= -0.7:
									ChangeTop("PFDHUDPanelGlideSlopePointer", -2.5 + "px");
									break;
								case PFD0.Stats.Nav.GlideSlopeDeviation > -0.7 && PFD0.Stats.Nav.GlideSlopeDeviation < 0.7:
									ChangeTop("PFDHUDPanelGlideSlopePointer", 117.5 + 120 * (PFD0.Stats.Nav.GlideSlopeDeviation / 0.7) + "px");
									break;
								case PFD0.Stats.Nav.GlideSlopeDeviation >= 0.7:
									ChangeTop("PFDHUDPanelGlideSlopePointer", 237.5 + "px");
									break;
								default:
									AlertSystemError("The value of PFD0.Stats.Nav.GlideSlopeDeviation \"" + PFD0.Stats.Nav.GlideSlopeDeviation + "\" in function RefreshHUDPanel is invalid.");
									break;
							}
							if(System.Display.Anim > 0) {
								ChangeAnim("PFDHUDPanelGlideSlopePointer", "100ms");
							} else {
								ChangeAnim("PFDHUDPanelGlideSlopePointer", "");
							}
							if(PFD0.Alert.Active.AltitudeWarning == "GlideSlope") {
								AddClass("PFDHUDPanelGlideSlopePointer", "GlideSlopeWarning");
							} else {
								RemoveClass("PFDHUDPanelGlideSlopePointer", "GlideSlopeWarning");
							}
							break;
						default:
							AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshHUDPanel is invalid.");
							break;
					}
				}

				// Marker beacon
				Fade("Ctnr_PFDHUDPanelMarkerBeacon");
				if(PFD.Nav.IsEnabled == true &&
				PFD0.Status.GPS.IsPositionAvailable == true &&
				(
					(PFD.Altitude.Mode == "GPS" && PFD0.Status.GPS.IsAltitudeAvailable == true) ||
					(PFD.Altitude.Mode == "Accel" && PFD0.Status.IsAccelAvailable == true) ||
					(PFD.Altitude.Mode == "DualChannel" && (PFD0.Status.GPS.IsAltitudeAvailable == true || PFD0.Status.IsAccelAvailable == true)) ||
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
									Show("Ctnr_PFDHUDPanelMarkerBeacon");
									ChangeMarkerBeaconColor(PFD0.Stats.Nav.MarkerBeacon);
									ChangeText("Label_PFDHUDPanelMarkerBeacon", Translate(PFD0.Stats.Nav.MarkerBeacon));
									break;
								default:
									AlertSystemError("The value of PFD0.Stats.Nav.MarkerBeacon \"" + PFD0.Stats.Nav.MarkerBeacon + "\" in function RefreshHUDPanel is invalid.");
									break;
							}
							break;
						default:
							AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshHUDPanel is invalid.");
							break;
					}
				}

				// Radio altitude
				if((
					(PFD.Altitude.Mode == "GPS" && PFD0.Status.GPS.IsAltitudeAvailable == true) ||
					(PFD.Altitude.Mode == "Accel" && PFD0.Status.IsAccelAvailable == true) ||
					(PFD.Altitude.Mode == "DualChannel" && (PFD0.Status.GPS.IsAltitudeAvailable == true || PFD0.Status.IsAccelAvailable == true)) ||
					PFD.Altitude.Mode == "Manual"
				) &&
				Math.abs(PFD0.Stats.Altitude.RadioDisplay) <= 762) {
					Show("Ctnr_PFDHUDPanelRadioAltitude");
					let ConvertedRadioAltitude = ConvertUnit(PFD0.Stats.Altitude.RadioDisplay, "Meter", Subsystem.I18n.AltitudeUnit),
					ConvertedRadioAltitudeDisplay = 0;
					switch(true) {
						case Math.abs(ConvertedRadioAltitude) >= 500:
							switch(Subsystem.I18n.AltitudeUnit) {
								case "Meter":
									ConvertedRadioAltitudeDisplay = Math.round(ConvertedRadioAltitude / 10) * 10;
									break;
								case "Feet":
								case "FeetButShowMeterBeside":
									ConvertedRadioAltitudeDisplay = Math.round(ConvertedRadioAltitude / 20) * 20;
									break;
								default:
									AlertSystemError("The value of Subsystem.I18n.AltitudeUnit \"" + Subsystem.I18n.AltitudeUnit + "\" in function RefreshHUDPanel is invalid.");
									break;
							}
							break;
						case Math.abs(ConvertedRadioAltitude) >= 100 && Math.abs(ConvertedRadioAltitude) < 500:
							switch(Subsystem.I18n.AltitudeUnit) {
								case "Meter":
									ConvertedRadioAltitudeDisplay = Math.round(ConvertedRadioAltitude / 5) * 5;
									break;
								case "Feet":
								case "FeetButShowMeterBeside":
									ConvertedRadioAltitudeDisplay = Math.round(ConvertedRadioAltitude / 10) * 10;
									break;
								default:
									AlertSystemError("The value of Subsystem.I18n.AltitudeUnit \"" + Subsystem.I18n.AltitudeUnit + "\" in function RefreshHUDPanel is invalid.");
									break;
							}
							break;
						case Math.abs(ConvertedRadioAltitude) < 100:
							switch(Subsystem.I18n.AltitudeUnit) {
								case "Meter":
									ConvertedRadioAltitudeDisplay = Math.round(ConvertedRadioAltitude);
									break;
								case "Feet":
								case "FeetButShowMeterBeside":
									ConvertedRadioAltitudeDisplay = Math.round(ConvertedRadioAltitude / 2) * 2;
									break;
								default:
									AlertSystemError("The value of Subsystem.I18n.AltitudeUnit \"" + Subsystem.I18n.AltitudeUnit + "\" in function RefreshHUDPanel is invalid.");
									break;
							}
							break;
						default:
							AlertSystemError("The value of Math.abs(ConvertedRadioAltitude) \"" + Math.abs(ConvertedRadioAltitude) + "\" in function RefreshHUDPanel is invalid.");
							break;
					}
					ChangeText("Label_PFDHUDPanelRadioAltitude", ConvertedRadioAltitudeDisplay);
				} else {
					Fade("Ctnr_PFDHUDPanelRadioAltitude");
				}

				// Decision altitude
				Fade("Ctnr_PFDHUDPanelDecisionAltitude");
				if((PFD.Altitude.Mode == "GPS" && PFD0.Status.GPS.IsAltitudeAvailable == true) ||
				(PFD.Altitude.Mode == "Accel" && PFD0.Status.IsAccelAvailable == true) ||
				(PFD.Altitude.Mode == "DualChannel" && (PFD0.Status.GPS.IsAltitudeAvailable == true || PFD0.Status.IsAccelAvailable == true)) ||
				PFD.Altitude.Mode == "Manual") {
					switch(PFD.FlightMode.FlightMode) {
						case "DepartureGround":
						case "TakeOff":
						case "Cruise":
							break;
						case "Land":
						case "ArrivalGround":
							Show("Ctnr_PFDHUDPanelDecisionAltitude");
							ChangeText("Label_PFDHUDPanelDecisionAltitudeValue", Math.trunc(ConvertUnit(PFD.Altitude.AirportElevation.Arrival + PFD.Altitude.DecisionHeight, "Meter", Subsystem.I18n.AltitudeUnit)));
							if(PFD0.Status.IsDecisionAltitudeActive == true) {
								if(PFD0.Stats.ClockTime - PFD0.Stats.Altitude.DecisionTimestamp < 3000) {
									AddClass("Ctnr_PFDHUDPanelDecisionAltitude", "Warning");
								} else {
									RemoveClass("Ctnr_PFDHUDPanelDecisionAltitude", "Warning");
								}
							} else {
								RemoveClass("Ctnr_PFDHUDPanelDecisionAltitude", "Warning");
							}
							break;
						case "EmergencyReturn":
							Show("Ctnr_PFDHUDPanelDecisionAltitude");
							ChangeText("Label_PFDHUDPanelDecisionAltitudeValue", Math.trunc(ConvertUnit(PFD.Altitude.AirportElevation.Departure + PFD.Altitude.DecisionHeight, "Meter", Subsystem.I18n.AltitudeUnit)));
							if(PFD0.Status.IsDecisionAltitudeActive == true) {
								if(PFD0.Stats.ClockTime - PFD0.Stats.Altitude.DecisionTimestamp < 3000) {
									AddClass("Ctnr_PFDHUDPanelDecisionAltitude", "Warning");
								} else {
									RemoveClass("Ctnr_PFDHUDPanelDecisionAltitude", "Warning");
								}
							} else {
								RemoveClass("Ctnr_PFDHUDPanelDecisionAltitude", "Warning");
							}
							break;
						default:
							AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshHUDPanel is invalid.");
							break;
					}
				}

				// Warning
				Fade("Ctnr_PFDHUDPanelWarning");
				if(PFD0.Alert.Active.AttitudeWarning != "") {
					Show("Ctnr_PFDHUDPanelWarning");
					ChangeText("Label_PFDHUDPanelWarning", Translate(PFD0.Alert.Active.AttitudeWarning));
				}
				if(PFD0.Alert.Active.SpeedWarning != "") {
					Show("Ctnr_PFDHUDPanelWarning");
					ChangeText("Label_PFDHUDPanelWarning", Translate(PFD0.Alert.Active.SpeedWarning));
				}
				if(PFD0.Alert.Active.AltitudeWarning != "") {
					Show("Ctnr_PFDHUDPanelWarning");
					ChangeText("Label_PFDHUDPanelWarning", Translate(PFD0.Alert.Active.AltitudeWarning));
				}
			}
