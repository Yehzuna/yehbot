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

    /**
     * Api constructor.
     */
    public function __construct()
    {
        if(!$request = $this->parseUrl($_REQUEST['_url'])) {
            $this->response(400, "Bad Request");
        }

        if ($_SERVER["REQUEST_METHOD"] != "GET" && $_SERVER["REQUEST_METHOD"] != "POST") {
            $this->response(401, "Unauthorized");
        }

        $data = false;

        $method = "get$request";
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $method = "set$request";

            $json = file_get_contents("php://input");
            $data = json_decode($json, true);
        }

        //var_dump($data);
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

    private function parseUrl($url)
    {
        if(preg_match("/^\/([a-z]+)\/([a-z0-9]+)$/", $url, $matches)) {

            $this->channel = $matches[2];

            return ucfirst($matches[1]);
        }

        return false;
    }

    private function setEmotes($string)
    {
        $data = $this->getEmotesList();

        $string = htmlspecialchars($string);
        //var_dump($string);

        $list = [];
        $emotes = [];
        foreach($data["emoticons"] as $emote) {
            if(is_null($emote["emoticon_set"])) {
                $emotes[] = $emote;

                if(preg_match_all("#{$emote['code']}#", $string, $matches)) {
                    $nb = count($matches[0]);
                    for($i = 0; $i < $nb; $i++) {
                        $list[] = $emote['id'];
                    }
                }
            }
        }
        //var_dump($list);
        //var_dump($emotes);

        echo json_encode($list);
        $this->response(200, "Ok");
    }

    private function getEmotesList()
    {
        $file = self::PATH . "emotes.json";

        $date = filemtime($file) + 60*60*24;
        if (!is_file($file) || $date < time()) {
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, "https://api.twitch.tv/kraken/chat/emoticon_images");
            curl_setopt($curl, CURLOPT_HEADER, false);
            curl_setopt($curl, CURLOPT_HTTPHEADER, [
                "Accept: application/vnd.twitchtv.v5+json",
                "Client-ID: 5enpkcr8pv8n4b84d60nm6tt2w07q4"
            ]);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            $data = curl_exec($curl);
            curl_close($curl);

            file_put_contents($file, $data);
        } else {
            $data = file_get_contents($file);
        }

        return json_decode($data, true);
    }


    /**
     * Update the config json.
     * @param array $data
     */
    private function setBits($data)
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
    private function getBits()
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