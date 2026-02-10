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
				if(PFD0.Status.GPS.PermissionStatus != "Denied") {
					if(PFD0.Status.GPS.IsActive) {
						if(PFD0.Status.GPS.IsPositionAvailable) {
							if(PFD0.Status.GPS.IsPositionAccurate && PFD0.Status.GPS.IsAltitudeAccurate) {
								ChangeText("Label_PFDHUDPanelGPSValue", Translate("Normal"));
							} else {
								ChangeText("Label_PFDHUDPanelGPSValue", Translate("SignalWeak"));
							}
						} else {
							ChangeText("Label_PFDHUDPanelGPSValue", Translate("Unavailable"));
						}
					} else {
						ChangeText("Label_PFDHUDPanelGPSValue", Translate("Inactive"));
					}
				} else {
					ChangeText("Label_PFDHUDPanelGPSValue", Translate("Denied"));
				}
				if(PFD0.Status.Sensor.PermissionStatus != "Denied") {
					if(PFD0.Status.Sensor.IsActive) {
						if(PFD0.Status.Sensor.IsAttitudeAvailable || PFD0.Status.Sensor.IsHeadingAvailable) {
							ChangeText("Label_PFDHUDPanelSensorValue", Translate("Normal"));
						} else {
							ChangeText("Label_PFDHUDPanelSensorValue", Translate("Unavailable"));
						}
					} else {
						ChangeText("Label_PFDHUDPanelSensorValue", Translate("Inactive"));
					}
				} else {
					ChangeText("Label_PFDHUDPanelSensorValue", Translate("Denied"));
				}

				// FMA
				ChangeText("Label_PFDHUDPanelSpeedModeValue", Translate(PFD.Speed.Mode));
				ChangeText("Label_PFDHUDPanelAltitudeModeValue", Translate(PFD.Altitude.Mode));
				switch(PFD.Heading.Mode) {
					case "Auto":
						if(PFD0.Status.GPS.IsHeadingAvailable && PFD0.Stats.Speed.GSDisplay >= 2.572) {
							ChangeText("Label_PFDHUDPanelHeadingModeValue", Translate("GPS"));
						} else {
							ChangeText("Label_PFDHUDPanelHeadingModeValue", Translate("Sensor"));
						}
						break;
					case "GPS":
					case "Sensor":
					case "Manual":
						ChangeText("Label_PFDHUDPanelHeadingModeValue", Translate(PFD.Heading.Mode));
						break;
					default:
						AlertSystemError("The value of PFD.Heading.Mode \"" + PFD.Heading.Mode + "\" in function RefreshHUDPanel is invalid.");
						break;
				}
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
				if(PFD.Attitude.IsEnabled) {
					if(PFD0.Stats.Attitude.IsValid) {
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
						ChangeTop("CtrlGroup_PFDHUDPanelAttitudePitch", "calc(50% - 1800px + " + 20 * PFD0.Stats.Attitude.PitchDisplay + "px)");
						ChangeRotate("Ctrl_PFDHUDPanelAttitudePitch", -PFD0.Stats.Attitude.RollDisplay);
						ChangeRotate("CtrlGroup_PFDHUDPanelAttitudeRollScale", -PFD0.Stats.Attitude.RollDisplay);
						if(PFD0.Stats.Attitude.RollDisplay <= 0) {
							document.getElementById("ProgringFg_PFDHUDPanelAttitudeRoll").style.strokeDasharray = (Math.PI * 620) * (-PFD0.Stats.Attitude.RollDisplay / 360) + "px, " + (Math.PI * 620) * (1 + PFD0.Stats.Attitude.RollDisplay / 360) + "px";
						} else {
							document.getElementById("ProgringFg_PFDHUDPanelAttitudeRoll").style.strokeDasharray = "0, " + (Math.PI * 620) * (1 - PFD0.Stats.Attitude.RollDisplay / 360) + "px, " + (Math.PI * 620) * (PFD0.Stats.Attitude.RollDisplay / 360) + "px";
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
				if(PFD0.Stats.Speed.IsValid) {
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
					ChangeTop("CtrlGroup_PFDHUDPanelSpeedTape", "calc(50% - 5000px + " + 5 * ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) + "px)");

					// Additional indicators
						// Speed trend
						if(Math.abs(ConvertUnit(PFD0.Stats.Speed.TrendDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed)) >= 3) {
							Show("Needle_PFDHUDPanelSpeedTrend");
						} else {
							Fade("Needle_PFDHUDPanelSpeedTrend");
						}
						ChangeTop("Needle_PFDHUDPanelSpeedTrend", "calc(50% - " + 5 * Math.abs(ConvertUnit(PFD0.Stats.Speed.TrendDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed)) + "px)");
						ChangeHeight("Needle_PFDHUDPanelSpeedTrend", 10 * Math.abs(ConvertUnit(PFD0.Stats.Speed.TrendDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed)) + "px");
						if(PFD0.Stats.Speed.TrendDisplay >= 0) {
							RemoveClass("Needle_PFDHUDPanelSpeedTrend", "Decreasing");
						} else {
							AddClass("Needle_PFDHUDPanelSpeedTrend", "Decreasing");
						}

						// Other speeds
						ChangeTop("CtrlGroup_PFDHUDPanelOtherSpeeds", "calc(50% - 5000px + " + 5 * ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) + "px)");
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
									ChangeHeight("Ctrl_PFDHUDPanelSpeedLimitMin", 5 * ConvertUnit(PFD0.Stats.Speed.Limit.Min, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) + "px");
									break;
								default:
									AlertSystemError("The value of PFD.FlightMode.FlightMode \"" + PFD.FlightMode.FlightMode + "\" in function RefreshHUDPanel is invalid.");
									break;
							}
							ChangeHeight("Ctrl_PFDHUDPanelSpeedLimitMax", 5 * (1000 - ConvertUnit(PFD0.Stats.Speed.Limit.Max, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed)) + "px");

							// Avg IAS
							ChangeBottom("Ctrl_PFDHUDPanelAvgIAS", 5 * ConvertUnit(PFD0.Stats.Speed.AvgIASDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) - 10 + "px");

							// MCP
							if(PFD.MCP.Speed.IsEnabled) {
								Show("Ctrl_PFDHUDPanelMCPSpeedCircle");
								ChangeBottom("Ctrl_PFDHUDPanelMCPSpeedCircle", 5 * ConvertUnit(PFD.MCP.Speed.IAS, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) - 10 + "px");
							} else {
								Fade("Ctrl_PFDHUDPanelMCPSpeedCircle");
							}

							// Take off
							switch(PFD.FlightMode.FlightMode) {
								case "DepartureGround":
									Show("Ctrl_PFDHUDPanelV1");
									Show("Ctrl_PFDHUDPanelVR");
									ChangeBottom("Ctrl_PFDHUDPanelV1", 5 * ConvertUnit(PFD.Speed.TakeOff.V1, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) + "px");
									ChangeBottom("Ctrl_PFDHUDPanelVR", 5 * ConvertUnit(PFD.Speed.TakeOff.VR, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) + "px");
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
						case ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) < 1:
							ChangeTop("RollingDigit_PFDHUDPanelSpeed3", 15 - 30 * (18 - PFD0.Stats.Speed.BalloonDisplay[3]) + "px");
							break;
						case ConvertUnit(PFD0.Stats.Speed.TapeDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed) > 998:
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
					if(PFD.MCP.Speed.IsEnabled) {
						Show("Ctrl_PFDHUDPanelMCPSpeed");
						switch(PFD.MCP.Speed.Mode) {
							case "IAS":
								ChangeText("Label_PFDHUDPanelMCPSpeed", ConvertUnit(PFD.MCP.Speed.IAS, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed).toFixed(0));
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
					ChangeText("Label_PFDHUDPanelSpeedGSValue", ConvertUnit(PFD0.Stats.Speed.GSDisplay, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed).toFixed(0));
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
				if(PFD0.Stats.Altitude.IsValid) {
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
					ChangeTop("CtrlGroup_PFDHUDPanelAltitudeTape", "calc(50% - 37500px + " + 0.75 * ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) + "px)");

					// Additional indicators
						// Altitude trend
						if(Math.abs(ConvertUnit(PFD0.Stats.Altitude.TrendDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude)) >= 20) {
							Show("Needle_PFDHUDPanelAltitudeTrend");
						} else {
							Fade("Needle_PFDHUDPanelAltitudeTrend");
						}
						ChangeTop("Needle_PFDHUDPanelAltitudeTrend", "calc(50% - " + 0.75 * Math.abs(ConvertUnit(PFD0.Stats.Altitude.TrendDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude)) + "px)");
						ChangeHeight("Needle_PFDHUDPanelAltitudeTrend", 1.5 * Math.abs(ConvertUnit(PFD0.Stats.Altitude.TrendDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude)) + "px");
						if(PFD0.Stats.Altitude.TrendDisplay >= 0) {
							RemoveClass("Needle_PFDHUDPanelAltitudeTrend", "Decreasing");
						} else {
							AddClass("Needle_PFDHUDPanelAltitudeTrend", "Decreasing");
						}

						// Other altitudes
						ChangeTop("CtrlGroup_PFDHUDPanelOtherAltitudes", "calc(50% - 37500px + " + 0.75 * ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) + "px)");
							// Ground altitude
							ChangeBottom("Ctrl_PFDHUDPanelGroundAltitude", 0.75 * (ConvertUnit(PFD0.Stats.Altitude.Ground, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) + 2000) - 40 + "px");

							// Decision altitude
							switch(PFD.FlightMode.FlightMode) {
								case "DepartureGround":
								case "TakeOff":
								case "Cruise":
									Fade("Ctrl_PFDHUDPanelDecisionAltitude");
									break;
								case "Land":
								case "ArrivalGround":
								case "EmergencyReturn":
									Show("Ctrl_PFDHUDPanelDecisionAltitude");
									ChangeBottom("Ctrl_PFDHUDPanelDecisionAltitude", 0.75 * (ConvertUnit(PFD0.Stats.Altitude.Ground + AirportLibrary0.ActiveAirport.Runway[AirportLibrary0.ActiveAirport.RunwaySelection].DecisionHeight, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) + 2000) - 10 + "px");
									if(PFD0.Status.IsDecisionAltitudeActive) {
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
							if(PFD.MCP.Altitude.IsEnabled) {
								Show("Ctrl_PFDHUDPanelMCPAltitudeCircle");
								ChangeBottom("Ctrl_PFDHUDPanelMCPAltitudeCircle", 0.75 * (ConvertUnit(PFD.MCP.Altitude.Value, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) + 2000) - 10 + "px");
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
						case ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) < -1980:
							ChangeTop("RollingDigit_PFDHUDPanelAltitude4", 17.5 - 25 * (21 - PFD0.Stats.Altitude.BalloonDisplay[4] / 20) + "px");
							break;
						case ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) >= -1980 &&
						ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) <= -20:
							ChangeTop("RollingDigit_PFDHUDPanelAltitude4", 17.5 - 25 * (17 - PFD0.Stats.Altitude.BalloonDisplay[4] / 20) + "px");
							break;
						case ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) > -20 &&
						ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) < 20:
							ChangeTop("RollingDigit_PFDHUDPanelAltitude4", 17.5 - 25 * (13 - PFD0.Stats.Altitude.BalloonDisplay[4] / 20) + "px");
							break;
						case ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) >= 20 &&
						ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) <= 49980:
							ChangeTop("RollingDigit_PFDHUDPanelAltitude4", 17.5 - 25 * (9 - PFD0.Stats.Altitude.BalloonDisplay[4] / 20) + "px");
							break;
						case ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) > 49980:
							ChangeTop("RollingDigit_PFDHUDPanelAltitude4", 17.5 - 25 * (5 - PFD0.Stats.Altitude.BalloonDisplay[4] / 20) + "px");
							break;
						default:
							AlertSystemError("The value of ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, \"Meter\", Subsystem.I18n.MeasurementUnit.Altitude) \"" + ConvertUnit(PFD0.Stats.Altitude.TapeDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Altitude) + "\" in function RefreshHUDPanel is invalid.");
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
					if(PFD.MCP.Altitude.IsEnabled) {
						Show("Ctrl_PFDHUDPanelMCPAltitude");
						ChangeText("Label_PFDHUDPanelMCPAltitude", Math.trunc(ConvertUnit(PFD.MCP.Altitude.Value, "Meter", Subsystem.I18n.MeasurementUnit.Altitude).toFixed(0) / 100) +
							"<span class=\"SmallerText\">" + Math.abs(ConvertUnit(PFD.MCP.Altitude.Value, "Meter", Subsystem.I18n.MeasurementUnit.Altitude).toFixed(0) % 100).toString().padStart(2, "0") + "</span>");
					}

					// Metric
					switch(Subsystem.I18n.MeasurementUnit.Altitude) {
						case "Meter":
						case "Foot":
							break;
						case "FootButShowMeterBeside":
							Show("Ctrl_PFDHUDPanelMetricAltitude");
							ChangeText("Label_PFDHUDPanelMetricAltitude", PFD0.Stats.Altitude.TapeDisplay.toFixed(0) + "<span class=\"SmallerText\">" + Translate("MeterOnPFD") + "</span>");
							break;
						default:
							AlertSystemError("The value of Subsystem.I18n.MeasurementUnit.Altitude \"" + Subsystem.I18n.MeasurementUnit.Altitude + "\" in function RefreshHUDPanel is invalid.");
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
				if(PFD0.Stats.Heading.IsValid) {
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
					if(PFD0.Stats.Nav.IsValid) {
						Show("Ctrl_PFDHUDPanelBearing");
						ChangeRotate("Ctrl_PFDHUDPanelBearing", PFD0.Stats.Nav.Bearing - PFD0.Stats.Heading.Display);
					} else {
						Fade("Ctrl_PFDHUDPanelBearing");
					}
					if(PFD.MCP.Heading.IsEnabled) {
						Show("Ctrl_PFDHUDPanelMCPHeadingCircle");
						ChangeRotate("Ctrl_PFDHUDPanelMCPHeadingCircle", PFD.MCP.Heading.Value - PFD0.Stats.Heading.Display);
					} else {
						Fade("Ctrl_PFDHUDPanelMCPHeadingCircle");
					}
					ChangeText("Label_PFDHUDPanelHeadingBalloon", PFD0.Stats.Heading.Display.toFixed(0).toString().padStart(3, "0"));
					if(PFD.MCP.Heading.IsEnabled) {
						Show("Ctrl_PFDHUDPanelMCPHeading");
						ChangeText("Label_PFDHUDPanelMCPHeading", PFD.MCP.Heading.Value.toFixed(0).toString().padStart(3, "0"));
					}
				} else {
					Show("Ctrl_PFDHUDPanelHeadingStatus");
					ChangeText("Label_PFDHUDPanelHeadingStatus", Translate("HeadingUnavailable"));
				}

				// Wind
				if(PFD.Speed.Wind.Speed > 0 && PFD0.Stats.Heading.IsValid) {
					Show("Ctnr_PFDHUDPanelWind");
					ChangeRotate("Needle_PFDHUDPanelWindDirection", PFD0.Stats.Speed.Wind.RelativeHeading);
					ChangeText("Label_PFDHUDPanelWind", ConvertUnit(PFD.Speed.Wind.Speed, "MeterPerSec", Subsystem.I18n.MeasurementUnit.Speed).toFixed(0));
				} else {
					Fade("Ctnr_PFDHUDPanelWind");
				}

				// Vertical speed
				if(PFD0.Stats.Altitude.IsValid) {
					let ConvertedVerticalSpeed = 0, VerticalSpeedDisplay = 0;
					ConvertedVerticalSpeed = ConvertUnit(PFD0.Stats.Speed.Vertical, "MeterPerSec", Subsystem.I18n.MeasurementUnit.VerticalSpeed);
					if((Subsystem.I18n.MeasurementUnit.VerticalSpeed == "MeterPerSec" && Math.abs(ConvertedVerticalSpeed) >= 0.2) ||
					(Subsystem.I18n.MeasurementUnit.VerticalSpeed == "FeetPerMin" && Math.abs(ConvertedVerticalSpeed) >= 50)) {
						Show("Ctnr_PFDHUDPanelVerticalSpeed");
						if(ConvertedVerticalSpeed >= 0) {
							RemoveClass("Icon_PFDHUDPanelVerticalSpeed", "Decreasing");
						} else {
							AddClass("Icon_PFDHUDPanelVerticalSpeed", "Decreasing");
						}
						switch(Subsystem.I18n.MeasurementUnit.VerticalSpeed) {
							case "MeterPerSec":
								VerticalSpeedDisplay = CheckRangeAndCorrect(Math.trunc(ConvertedVerticalSpeed / 0.2) * 0.2, -50, 50);
								ChangeText("Label_PFDHUDPanelVerticalSpeed", Math.abs(VerticalSpeedDisplay).toFixed(1));
								break;
							case "FeetPerMin":
								VerticalSpeedDisplay = CheckRangeAndCorrect(Math.trunc(ConvertedVerticalSpeed / 50) * 50, -9999, 9999);
								ChangeText("Label_PFDHUDPanelVerticalSpeed", Math.abs(VerticalSpeedDisplay));
								break;
							default:
								AlertSystemError("The value of Subsystem.I18n.MeasurementUnit.VerticalSpeed \"" + Subsystem.I18n.MeasurementUnit.VerticalSpeed + "\" in function RefreshHUDPanel is invalid.");
								break;
						}
					} else {
						Fade("Ctnr_PFDHUDPanelVerticalSpeed");
					}
				} else {
					Fade("Ctnr_PFDHUDPanelVerticalSpeed");
				}

				// DME
				if(PFD0.Stats.Nav.IsValid) {
					Show("Ctnr_PFDHUDPanelDME");
					ChangeText("Label_PFDHUDPanelDMERunway", Translate("Runway") + " " + AirportLibrary0.ActiveRunwayName);
					if(PFD0.Stats.Nav.DistanceDisplay < 10000000) { // Max 10000 kilometers.
						ChangeText("Label_PFDHUDPanelDMEDistance", ConvertUnit(PFD0.Stats.Nav.DistanceDisplay, "Meter", Subsystem.I18n.MeasurementUnit.Distance).toFixed(1) + "<span class=\"SmallerText\">" + Translate(Subsystem.I18n.MeasurementUnit.Distance + "OnPFD") + "</span>");
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
				if(PFD0.Stats.Nav.IsValid && PFD0.Stats.Heading.IsValid) {
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
				if(PFD0.Stats.Nav.IsValid && PFD0.Stats.Altitude.IsValid) {
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
				if(PFD0.Stats.Nav.IsValid && PFD0.Stats.Altitude.IsValid && PFD0.Stats.Heading.IsValid) {
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
									ChangeMarkerBeacon(PFD0.Stats.Nav.MarkerBeacon);
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
				if(PFD0.Stats.Altitude.IsValid && (PFD0.Stats.Altitude.RadioDisplay > -304.8 && PFD0.Stats.Altitude.RadioDisplay <= 762)) {
					Show("Ctnr_PFDHUDPanelRadioAltitude");
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
									AlertSystemError("The value of Subsystem.I18n.MeasurementUnit.Altitude \"" + Subsystem.I18n.MeasurementUnit.Altitude + "\" in function RefreshHUDPanel is invalid.");
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
									AlertSystemError("The value of Subsystem.I18n.MeasurementUnit.Altitude \"" + Subsystem.I18n.MeasurementUnit.Altitude + "\" in function RefreshHUDPanel is invalid.");
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
									AlertSystemError("The value of Subsystem.I18n.MeasurementUnit.Altitude \"" + Subsystem.I18n.MeasurementUnit.Altitude + "\" in function RefreshHUDPanel is invalid.");
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
				if(PFD0.Stats.Altitude.IsValid) {
					switch(PFD.FlightMode.FlightMode) {
						case "DepartureGround":
						case "TakeOff":
						case "Cruise":
							break;
						case "Land":
						case "ArrivalGround":
						case "EmergencyReturn":
							Show("Ctnr_PFDHUDPanelDecisionAltitude");
							ChangeText("Label_PFDHUDPanelDecisionAltitudeValue", Math.trunc(ConvertUnit(PFD0.Stats.Altitude.Ground + AirportLibrary0.ActiveAirport.Runway[AirportLibrary0.ActiveAirport.RunwaySelection].DecisionHeight, "Meter", Subsystem.I18n.MeasurementUnit.Altitude)));
							if(PFD0.Status.IsDecisionAltitudeActive) {
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
