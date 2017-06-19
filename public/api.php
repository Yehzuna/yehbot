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

    private $channel;
    private $action;

    /**
     * Api constructor.
     */
    public function __construct()
    {
        if(!$this->parseUrl($_REQUEST['_url'])) {
            $this->response(400, "Bad Request");
        }

        if ($_SERVER["REQUEST_METHOD"] != "GET" && $_SERVER["REQUEST_METHOD"] != "POST") {
            $this->response(401, "Unauthorized");
        }

        $data = false;

        $method = "get{$this->action}";
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $method = "set{$this->action}";

            $json = file_get_contents("php://input");
            $data = json_decode($json, true);
        }

        //var_dump($method);

        if (method_exists("Api", $method)) {
            if ($data) {
                $this->$method($data);
            } else {
                $this->$method();
            }
        }

        $this->response(400, "Bad Request");
    }

    /**
     * /api/channel/action
     * @param $url
     * @return bool
     */
    private function parseUrl($url)
    {
        if(preg_match("/^\/([a-z0-9]+)\/([a-z0-9]+)$/", $url, $matches)) {

            $this->action = ucfirst($matches[2]);
            $this->channel = $matches[1];

            return true;
        }

        return false;
    }

    /**
     * Update the config json.
     * @param array $data
     */
    private function setConfig($data)
    {
        $file = self::PATH . "config.{$this->channel}.json";

        if (!file_put_contents($file, json_encode($data))) {
            $this->response(500, "Internal Server Error");
        }

        $this->response(204, "No Content");
    }

    /**
     * Update the config json.
     * @param array $data
     */
    private function setCheers($data)
    {
        $file = self::PATH . "bits.{$this->channel}.json";

        if ($json = file_get_contents($file)) {
            $users = json_decode($json, true);
        } else {
            $users = [];
        }

        $add = false;
        foreach ($users as &$user) {
            if ($user["id"] == $data["id"]) {
                $user["total"] += $data["total"];
                $add = true;
            }
        }

        if (!$add) {
            $users[] = $data;
        }

        if (!file_put_contents($file, json_encode($users))) {
            $this->response(500, "Internal Server Error");
        }

        $this->response(204, "No Content");
    }

    /**
     *
     */
    private function getCheers()
    {
        $file = self::PATH . "bits.{$this->channel}.json";

        if ($json = file_get_contents($file)) {

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