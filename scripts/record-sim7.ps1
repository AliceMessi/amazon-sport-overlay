$env:PATH="$env:LOCALAPPDATA\Android\Sdk\platform-tools;$env:PATH"
adb -s emulator-5554 shell input keyevent KEYCODE_BACK
Start-Sleep 2
adb -s emulator-5554 shell monkey -p tech.hokentech.sportoverlay -c android.intent.category.LEANBACK_LAUNCHER 1
Start-Sleep 6
adb -s emulator-5554 shell input tap 1435 1011
Start-Sleep 16
adb -s emulator-5554 shell input tap 1550 117
Start-Sleep 4
adb -s emulator-5554 shell input tap 1550 117
Start-Sleep 4
adb -s emulator-5554 shell input keyevent KEYCODE_BACK
Start-Sleep 5
adb -s emulator-5554 shell input keyevent KEYCODE_DPAD_RIGHT
Start-Sleep 1
adb -s emulator-5554 shell input keyevent KEYCODE_DPAD_CENTER
Start-Sleep 3
adb -s emulator-5554 shell input keyevent KEYCODE_DPAD_LEFT
Start-Sleep 1
adb -s emulator-5554 shell input keyevent KEYCODE_DPAD_CENTER
Start-Sleep 3
adb -s emulator-5554 shell input keyevent KEYCODE_DPAD_DOWN
Start-Sleep 1
adb -s emulator-5554 shell input keyevent KEYCODE_DPAD_DOWN
Start-Sleep 4
echo SCRIPT-DONE
