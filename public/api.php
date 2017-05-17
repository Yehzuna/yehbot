<?php

//error_reporting(E_ALL);
//ini_set("display_errors", 1);

/**
 * Class Api
 */
class Api
{

    /**
     * Data path.
     */
    const PATH = "data/";

    /**
     * Api constructor.
     */
    public function __construct()
    {

        if ($_SERVER["REQUEST_METHOD"] == "GET") {

        }

        if ($_SERVER["REQUEST_METHOD"] != "POST") {
            $request = file_get_contents("php://input");
            if ($json = json_decode($request, true)) {

            }
        }

        $this->response(401, "Unauthorized");
    }

    /**
     * Update the config json.
     * @param array $data
     */
    private function setBits($data)
    {
        if (!file_put_contents(self::PATH . "config.json", json_encode($data))) {
            $this->response(500, "Internal Server Error");
        }

        $this->response(204, "No Content");
    }

    private function getBits($data)
    {
        if (!file_get_contents(self::PATH . "config.json")) {
            echo json_decode();

            $this->response(200, "Ok");
        }

        $this->response(204, "No Content");
    }

    /**
     * Send the response.
     * @param int $code
     * @param string $status
     */
    private function response($code, $status)
    {
        header("HTTP/1.0 $code $status");
        exit;
    }
}

$api = new Api();