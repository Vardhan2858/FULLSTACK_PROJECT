public class UserController {

    private final UserRepository repo;
    private final JwtUtil jwtUtil;

    public UserController() {
        this.repo = new InMemoryUserRepository();
        this.jwtUtil = new JwtUtil();
    }

    public String login(User user) {
        if (user == null || user.getEmail() == null || user.getPassword() == null) {
            return "Invalid Credentials";
        }

        User existing = repo.findByEmail(user.getEmail());
        if (existing != null && existing.getPassword().equals(user.getPassword())) {
            return jwtUtil.generateToken(user.getEmail());
        }

        return "Invalid Credentials";
    }

    public static class User {
        private String email;
        private String password;

        public User() {
        }

        public User(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    interface UserRepository {
        User findByEmail(String email);
    }

    static class InMemoryUserRepository implements UserRepository {
        @Override
        public User findByEmail(String email) {
            if ("admin@organic.com".equals(email)) {
                return new User("admin@organic.com", "admin123");
            }
            return null;
        }
    }

    static class JwtUtil {
        public String generateToken(String email) {
            return "token-" + email;
        }
    }
}