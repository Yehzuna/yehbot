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
     * @var string The current channel.
     */
    private $channel;

    /**
     * @var string The current action.
     */
    private $action;

    /**
     * Api constructor.
     */
    public function __construct()
    {
        if (!$this->parseUrl($_REQUEST['_url'])) {
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
     * Parse an url.
     * /api/channel/action
     * @param $url
     * @return bool
     */
    private function parseUrl($url)
    {
        if (preg_match("/^\/([a-z0-9]+)\/([a-z0-9]+)$/", $url, $matches)) {

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
     * Read the config json.
     */
    private function getConfig()
    {
        $file = self::PATH . "config.{$this->channel}.json";

        $this->checkFile($file);

        if ($json = file_get_contents($file)) {
            echo $json;

            $this->response(200, "Ok");
        }

        $this->response(500, "Internal Server Error");
    }

    /**
     * Update the cheers json.
     * @param array $data {"id":"123456","name":"name","total":100}
     */
    private function setCheers($data)
    {
        $file = self::PATH . "cheers.{$this->channel}.json";

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
     * Read the cheers json.
     */
    private function getCheers()
    {
        $file = self::PATH . "cheers.{$this->channel}.json";

        $this->checkFile($file);

        if ($json = file_get_contents($file)) {
            echo $json;

            $this->response(200, "Ok");
        }

        $this->response(500, "Internal Server Error");
    }

    /**
     * Check if a file exist. Then create if not.
     * @param $file
     */
    private function checkFile($file)
    {
        if (!is_file($file)) {
            if (!file_put_contents($file, "[]")) {
                $this->response(500, "Internal Server Error");
            }
        }
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