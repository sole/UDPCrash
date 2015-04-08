# UDPCrash

This is a certified app demonstrating a crash when using UDPSockets and not closing them after sending a message.

Upon start you can tap FLOOD at a 20 ms interval (the host field is already set to ping itself). Approximately 540 pings afterwards Gaia will crash and the phone will restart it automatically.

Pinging other hosts also crashes Gaia, but it's easier to just crash the same phone you're testing the app on :-)

I also built [simple node.js test client and server scripts](https://github.com/sole/nodepinger) if you want to test this against other systems other than the phone itself.

Check it out, find your computer IP address, then run the server. In the phone, enter the computer IP address and press FLOOD to flood it with UDPSocket messages. After a while the phone will restart.
