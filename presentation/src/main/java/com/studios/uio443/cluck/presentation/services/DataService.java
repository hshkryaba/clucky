package com.studios.uio443.cluck.presentation.services;

import android.support.annotation.Nullable;

import com.studios.uio443.cluck.presentation.model.User;

import org.json.JSONObject;

/**
 * Класс DataService достаёт данные и заворачивает их в объекты-модели
 * Делаем класс синглтоном,
 * чтобы иметь везде доступ к одному и тому же объекту
 */
public class DataService {
    @Nullable
    private User user;

    private static volatile DataService instance;

    /**
     * Метод для получения ссылки на единственный объект
     * @return DataService
     */
    public static DataService getInstance() {
         DataService localInstance = instance;
         if(localInstance == null) {
             synchronized (DataService.class) {
                 localInstance = instance;
                 if(localInstance == null) {
                     instance = localInstance = new DataService();
                 }
             }
         }
         return localInstance;
    }

    /**
     * Метод для авторизации и получаения сущности пользователя
     * @param login логин
     * @param password пароль
     * @return User
     */
    public User authentication(String login, String password) {
        if(!login.equals("vasya@lol.com")) {
            return null;
        }
        user = new User();

        user.setId(1);
        user.setLogin(login);
        user.setPassword(password);
        user.setAccessToken("");
        user.setRefreshToken("");

        return user;
    }

    /**
     * Геттер сущности пользователя
     * @return User
     */
    @Nullable
    public User getUser() {
        return user;
    }

    /**
     * Метод для регистрации
     * @param login логин
     * @param password пароль
     * @param username имя пользователя
     * @return User
     */
    public User signup(String login, String password, String username) {
        if(!login.equals("vasya@lol.com")) {
            return null;
        }
        user = new User();

        user.setId(1);
        user.setLogin(login);
        user.setPassword(password);
        user.setAccessToken("");
        user.setRefreshToken("");

        return user;


    }

    /**
     * Метод для отладки RestService
     * @return String
     */
    //TODO: надо вызывать в отдельном потоке, иначе будет исключение NetworkOnMainThreadException
    public String testRest() {
        RestService rs = new RestService();

        RestService.Request r = new RestService.Request();
        r.method = RestService.METHOD_POST;
        r.url = "http://185.244.173.142/api/auth/login";
        r.headers.put("Content-Type", "application/json");
        r.body = "{\"login\":\"qwerty\", \"password\":\"qwerty\"}";

        JSONObject o;

        try {
            o = rs.request(r);
            return o.toString();
        } catch (Exception e) {
            e.getMessage();
            //Log.e("Some errors: ", e.getMessage());
        }

        return null;
    }

}
