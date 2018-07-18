package com.studios.uio443.cluck.services;

import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Класс RestService предоставляет возможность делать запросы по http
 * Парсит ответ сервера и возвращает JSONObject
 */
public class RestService {
    public static final String METHOD_GET = "GET";
    public static final String METHOD_POST = "POST";
    public static final String METHOD_PUT = "PUT";
    public static final String METHOD_DELETE = "DELETE";

    public static class Request {
        public String method;
        public String url;
        public HashMap <String, String> headers;
        public HashMap <String, String> queryParams;
        public String body;

        public Request() {
            this.method = RestService.METHOD_GET;
            this.url = "";
            this.headers = new HashMap<>();
            this.queryParams = new HashMap<>();
            this.body = "";
        }
    }

    public static class Response{
        public int status;
        public HashMap <String, String> headers;
        public String body;

        public Response() {
            this.status = 0;
            this.headers = new HashMap<>();
            this.body = "";
        }
    }

    /**
     * Основной метод для отправки запроса по http
     * @param request данные для запроса
     * @return JSONObject
     * @throws Exception кидает исключение, если что-то пошло не так
     */
    public JSONObject request(Request request) throws Exception {
        Response response = null;

        //check http method
        switch (request.method) {
            case RestService.METHOD_GET:
                response = this.get(request);
                break;
            case RestService.METHOD_POST:
                response = this.post(request);
                break;
            case RestService.METHOD_PUT:
                response = this.put(request);
                break;
            case RestService.METHOD_DELETE:
                response = this.delete(request);
                break;
        }

        if (response == null) {
            throw new Exception("Invalid response or incorrect method");
        }

        if (response.status < 200) {
            throw new Exception("Unknown http status");
        }

        return parseJson(response.body);
    }

    /**
     * Метод для отправки post-запроса
     * @param request данные запроса
     * @return Response
     */
    public Response post(Request request) {
        Response response = new Response();

        try {
            // open connection
            URL url = new URL(request.url);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoInput(true);

            // add body
            try (OutputStream output = connection.getOutputStream()) {
                output.write(request.body.getBytes());
            }

            // add headers
            for (HashMap.Entry<String, String> entry : request.headers.entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue();

                connection.setRequestProperty(key, value);
            }

            connection.connect();

            // get response http status
            response.status = connection.getResponseCode();

            // get response http headers
            Map<String, List<String>> headers = connection.getHeaderFields();
            for (Map.Entry<String, List<String>> entry : headers.entrySet()) {
                String key = entry.getKey();
                List<String> value = entry.getValue();

                response.headers.put(key, value.get(0));
            }

            // get response http body
            BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String output;

            while ((output = br.readLine()) != null) {
                sb.append(output);
            }

            response.body = sb.toString();
        } catch (MalformedURLException e) {
            Log.e("RestService.post", e.getMessage());
        } catch (IOException e) {
            Log.e("RestService.post", e.getMessage());
        }

        return response;
    }

    /**
     * Метод для отправки get-запроса
     * @param request данные запроса
     * @return Response
     */
    public Response get(Request request) {
        Response response = new Response();
        return response;
    }

    /**
     * Метод для отправки put-запроса
     * @param request данные запроса
     * @return Response
     */
    public Response put(Request request) {
        Response response = new Response();
        return response;
    }

    /**
     * Метод для отправки delete-запроса
     * @param request данные запроса
     * @return Response
     */
    public Response delete(Request request) {
        Response response = new Response();
        return response;
    }

    /**
     * Метод для парсинга json в JSONObject
     * @param json текст с json
     * @return JSONObject
     * @throws JSONException кидает исключение, если не удалось распарсить
     */
    public JSONObject parseJson(String json) throws JSONException {
        return new JSONObject(json);
    }
}
