<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);

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
            $this->getBits();
        }

        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $request = file_get_contents("php://input");
            if ($json = json_decode($request, true)) {
                $this->setBits($json);
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
        if (!$json = file_get_contents(self::PATH . "test.json")) {
            $this->response(500, "Internal Server Error");
        }

        $users = json_decode($json, true);
        $add = false;
        foreach ($users as $user) {
            if ($user["id"] == $data["id"]) {
                $user["total"] += $data["total"];
                $add = true;
            }
        }

        if (!$add) {
            $users[] = $data;
        }

        if (!file_put_contents(self::PATH . "test.json", json_encode($users))) {
            $this->response(500, "Internal Server Error");
        }

        $this->response(204, "No Content");
    }

    /**
     *
     */
    private function getBits()
    {
        if ($json = file_get_contents(self::PATH . "test.json")) {

            echo $json;
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