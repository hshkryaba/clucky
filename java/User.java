/*
Пользователи (клиенты) приложения
 */

@SuppressWarnings("ALL")
class User {

    private final int userID;
    private final String name;
    private final String surname;
    private final String username;
    private final String passwordHash;
    private final String accessToken;
    private final String authorizationKey;
    private final long createdDate;
    private final int score;

    User(int userID, String name, String surname, String username, String passwordHash, String accessToken,
                String authorizationKey, long createdDate, int score) {
        this.userID = userID;
        this.name = name;
        this.surname = surname;
        this.username = username;
        this.passwordHash = passwordHash;
        this.accessToken = accessToken;
        this.authorizationKey = authorizationKey;
        this.createdDate = createdDate;
        this.score = score;
    }
}
