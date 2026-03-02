# SunSync Preliminary Schematics

## Bill of Materials

- ESP32 x 1
- RGB LED Strips x 1
- PIR Motion Sensors x 1
- Potentiometers x 1
- Toggle Switches x 1
- Misc. components
  - Capacitors
  - Resistors
  - Brass heat-set screw inserts
  - Colored wires
  - Perforated Circuit Prototyping Boards

### BOM Summary

The system is composed of several aiding sensors, inputs and the microcomputer itself. The ESP32 is responsible for connecting to WiFi, syncing to an NTP pool for the current time, advertising itself with mDNS and providing a Web Interface for setting time and ambient brightness rules. 

Three photo resistors placed at equi-distant places on the lamp to provide ambient brightness data. This allows for at least one to be blocked whilst still being able to judge ambient brightness.

A front-mounted motion sensor lets the system correlate user activity to time of day. Also allows for detecting if the user is asleep or still awake when in bed.

The ESP32 will be responsible for the Web Interface, exposes an API and will handle controlling lights, reading sensor data and processing and cataloging events. The iOS and Android apps will handle providing native interfaces, and getting/adding sleep data to their phone's health logs.

## Assembly

The electronics will be wired together on some perfboard, hand-soldered for the time being. 

Notable electrical requirements include having the LED strip be powered separately from the ESP32, else electrical loads from the LEDs will create a voltage drop which could cause the ESP32 to reset. 

The motion sensor uses an SPI interface, which needs to be connected to the appropriately labelled pins on the ESP32.

The three photo-resistors are simple analogue components, so can be connected to any three analogue input pins.

A 3D printed shell for mounting components to will be satisfactory for a prototype. Some heat-set screw inserts embedded into the parts will allow for easy disassembly and reassembly without causing wear to parts. 

## Programming

The Arduino IDE is able to compile to an ESP32-compatible triple, and flash it. We'll use C++ due to its bare-metal nature allowing for the best possible performance and reduced memory requirements compared to MicroPython. 

The ESP32 has a confined amount of available non-volatile storage, usually 4MB. Our program and supporting static files can be around 3MB, leaving space for configuration storage, WiFi connection data and anything else. 

To be able to connect to WiFi, we'll use [tzapu/WiFiManager](https://github.com/tzapu/WiFiManager) for connecting to WiFi. This provides a captive WiFi web interface for users to configure the ESP32's WiFi if it couldn't find an access point to connect to, via an ad-hoc network.

The ESP32 standard libraries include a `WebServer` type, allowing easy definitions of routes. We'll define routes for the REST API and for the main site. The site's interactivity will trigger network requests to the API, so only the API will have backend logic for controlling settings and hardware. An iOS and Android app can be written in SwiftUI to provide a native interface to the API. No authentication will be needed since the lamp will be unable to accept communication outside of local network IP ranges.

The native iOS app will be written in [Swift](https://swift.org), making use of [SwiftUI](https://developer.apple.com/swiftui/), with the Android app mirroring the iOS codebase but making use of Android frameworks. Other than the apps scanning for the lamp on the local network, they're fairly easy to program and deploy.

The lamp itself will need to support saving and loading the user's sleep and wake times, remembering brightness curves set by the user, storing network authentication data and will need to use specialised hues of red and blue light in the right proportions to help the user sleep and wake up. 

### Biological Implications and Intended Effects

The lamp needs to deploy specific hues of red, white and blue light to stimulate certain kinds of hormone release. During the time the user wishes to sleep, we need to use dim, warm red light to stimulate melatonin release, signalling to the body that it's time to wind down and repair itself. This also lowers body temperature and blood pressure. Cool "blue-ish" white light triggers cortisol release, waking the body up. This increases heart rate, blood pressure and alertness. This will counter the feeling of not wanting to get up out of bed. This cold light will shift to standard lighting once the user has woken up.

The lamp doesn't necessarily need to be a night light. The intent is to mimick the sun in the user's blacked out room so they can sleep during the day if required. The potentiometer at the front of the lamp acts as a brightness override if the user requires light, otherwise if the potentiometer is fully off then the lamp is left in automatic mode. Automatic mode will use the specified user timings as appropriate. The following information is how automatic mode works.

During the specified sleep phase, the red light mode will be at dim brightness. This brightness will be maintained until motion detection has reduced substantially. Upon meeting that criteria, the brightness will reduce until at 0% (unless configured to maintain brightness through to the morning phase). If the user wakes up again (motion sensed), brightness will rise again to the same dim red as before. 

When the wake-up phase starts, the color will slowly shift to cool white. The brightness will slowly rise for the half-hour before and up to the user's specified wake-up time. If the user wakes up earlier than the wake up time, then the brightness will increase to max within a few seconds to compensate. 

## Note

This document is not final. The information here may be revised at any time.

Lakhan Lothiyi