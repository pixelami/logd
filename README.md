# logd
Log javascript console to http server

## Run the 

Clone the repo

    git clone git@github.com:pixelami/logd.git
    cd logd
    npm start

You should see the following message in the console

    started http-log-server at http://<IP_ADDRESS>:2022

Note the `<IP_ADDRESS>`, you will need it in the next step.

## Configure the Web Page for console capture

Add the following to `<head>` of HTML page you want to capture logs from

    <script src="http://<IP_ADDRESS>:2022/client"></script>

Happy debugging!