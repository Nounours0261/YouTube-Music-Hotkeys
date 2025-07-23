# YouTube Music Hotkeys

This extension allows you to use keyboard shortcuts to control playback on
YouTube Music.


## How to install

Go to `chrome://extensions/`, enable Developer Mode and click "Load unpacked".
Select this folder, and the extension should be enabled.

Since this extension uses Native Messaging to handle hotkeys, you will then
need to set it up. You can run the `setup.ps1` script to do this. It will ask 
you for the extension ID, which you can find on `chrome://extensions/` after
enabling it.

After running `setup.ps1`, you can reload Chrome and enjoy you music !


## How to use

Once the above steps are done, you can use the following hotkeys from anywhere
on your computer to control playback :
- Alt + F : play/pause the current song
- Alt + D : go back to previous song
- Alt + F : go to next song

It is not currently possible to change these hotkeys from the extension,
but you can do so by editing `src/keyboard.py`.

If you run into any issue with hotkeys, you can reload the Native Messaging
host by clicking the extension in the tray.


## Credit

The icon for the extension was created using a keyboard design by Gregor 
Cresnar uploaded to [Flaticon](https://www.flaticon.com/free-icons/keyboard),
as well as the favicon for [YouTube Music](https://music.youtube.com).