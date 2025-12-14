// For SamToki.github.io/GPS-PFD
// Released under GNU GPL v3 open source license.
// © 2025 SAM TOKI STUDIO

// Initialization
	// Declare variables
	"use strict";
		// Unsaved
		const CacheName = "GPS-PFD_v1.00";

// Listeners
	// Service worker (https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/#step-5---add-a-service-worker)
	self.addEventListener("install", Event => {
		Event.waitUntil((async() => {
			const CacheContent = await caches.open(CacheName);
			CacheContent.addAll([
				"index.html",
				"images/Icon_Small.png",
				"../styles/common.css",
				"../styles/common_Dark.css",
				"../styles/common_AtelierSophie2.css",
				"../styles/common_Genshin.css",
				"../styles/common_HighContrast.css",
				"styles/style.css",
				"styles/style_Dark.css",
				"styles/style_AtelierSophie2.css",
				"styles/style_Genshin.css",
				"styles/style_HighContrast.css",
				"styles/style_PFDHUDPanel.css",
				"styles/style_PFDAutomobileSpeedometerPanel.css",
				// "styles/style_PFD???.css",
				"../scripts/common.js",
				"../scripts/common_UserDataRepairer.js",
				"scripts/script_PFDNormalPanel.js",
				"scripts/script_PFDHUDPanel.js",
				"scripts/script_PFDAutomobileSpeedometerPanel.js",
				// "scripts/script_PFD???.js",
				"scripts/script.js",
				"manifests/manifest.json",
				"images/Icon.png",
				"images/Icon_Large.png",
				"images/Icon_Maskable.png",
				"images/Preview.jpg",
				"../fonts/Inter-Regular.woff2",
				"../fonts/Inter-Italic.woff2",
				"../fonts/Inter-Bold.woff2",
				"../fonts/Inter-BoldItalic.woff2",
				// "../fonts/Iosevka-Regular.woff2",
				"fonts/Century Gothic.ttf",
				"../images/Background.jpg",
				"../cursors/BTRAhoge.cur",
				"../cursors/Genshin.cur",
				"../cursors/GenshinFurina.cur",
				"../cursors/GenshinNahida.cur",
				"../cursors/SilentWitch.cur",
				"images/快捷键一览.jpg",
				"../audio/Beep.mp3",
				"audio/Airbus_5.mp3",
				"audio/Airbus_20.mp3",
				"audio/Airbus_30.mp3",
				"audio/Airbus_40.mp3",
				"audio/Airbus_50.mp3",
				"audio/Airbus_100.mp3",
				"audio/Airbus_200.mp3",
				"audio/Airbus_300.mp3",
				"audio/Airbus_400.mp3",
				"audio/Airbus_500.mp3",
				"audio/Airbus_1000.mp3",
				"audio/Airbus_2500.mp3",
				"audio/Airbus_AirspeedLow.mp3",
				"audio/Airbus_HundredAbove.mp3",
				"audio/Airbus_Minimums.mp3",
				"audio/Airbus_Overspeed.mp3",
				"audio/Airbus_Retard.mp3",
				"audio/Airbus_V1.mp3",
				"audio/Boeing_10.mp3",
				"audio/Boeing_20.mp3",
				"audio/Boeing_30.mp3",
				"audio/Boeing_40.mp3",
				"audio/Boeing_50.mp3",
				"audio/Boeing_100.mp3",
				"audio/Boeing_200.mp3",
				"audio/Boeing_300.mp3",
				"audio/Boeing_400.mp3",
				"audio/Boeing_500.mp3",
				"audio/Boeing_1000.mp3",
				"audio/Boeing_2500.mp3",
				"audio/Boeing_AirspeedLow.mp3",
				"audio/Boeing_ApproachingMinimums.mp3",
				"audio/Boeing_Minimums.mp3",
				"audio/Boeing_Overspeed.mp3",
				"audio/Boeing_V1.mp3",
				"audio/Common_AltitudeBeep.mp3",
				"audio/Common_BankAngle.mp3",
				"audio/Common_DontSink.mp3",
				"audio/Common_GlideSlope.mp3",
				"audio/Common_PullUp.mp3",
				"audio/Common_SinkRate.mp3",
				"docs/GPS-PFD 说明文档.pdf"
			]);
		})());
	});
	self.addEventListener("fetch", Event => {
		Event.respondWith((async() => {
			const CacheContent = await caches.open(CacheName);
			const CachedResponse = await CacheContent.match(Event.request);
			if(CachedResponse) {
				return CachedResponse;
			} else {
				const FetchResponse = await fetch(Event.request);
				CacheContent.put(Event.request, FetchResponse.clone());
				return FetchResponse;
			}
		})());
	});
