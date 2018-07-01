package com.studios.uio443.cluck;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.TextInputLayout;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.studios.uio443.cluck.models.User;
import com.studios.uio443.cluck.services.DataService;

public class SignupActivity extends AppCompatActivity {

    TextInputLayout signupUsernameLayout;
    TextInputLayout signupEmailLayout;
    TextInputLayout signupPasswordLayout;
    TextInputLayout signupReEnterPasswordLayout;
    EditText signupUsernameInput;
    EditText signupEmailInput;
    EditText signupPasswordInput;
    EditText signupReEnterPasswordInput;
    Button btnSignup;
    TextView linkLogin;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);

        initViews();

        btnSignup.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                signup();
            }
        });

        linkLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getApplicationContext(),LoginActivity.class);
                startActivity(intent);
                overridePendingTransition(R.anim.push_left_in, R.anim.push_left_out);
            }
        });

    }

    void initViews(){
        signupUsernameLayout = findViewById(R.id.signup_username_layout);
        signupEmailLayout = findViewById(R.id.signup_email_layout);
        signupPasswordLayout = findViewById(R.id.signup_password_layout);
        signupReEnterPasswordLayout = findViewById(R.id.signup_reEnterPassword_layout);
        signupUsernameInput = findViewById(R.id.signup_username_input);
        signupEmailInput = findViewById(R.id.signup_email_input);
        signupPasswordInput = findViewById(R.id.signup_password_input);
        signupReEnterPasswordInput = findViewById(R.id.signup_reEnterPassword_input);
        btnSignup = findViewById(R.id.btn_signup);
        linkLogin = findViewById(R.id.link_login);
    }

    public void signup() {
        Log.d("signup", "Signing Up");

        if (!validate()) {
            onSignupFailed();
            return;
        }

        btnSignup.setEnabled(false);

        String username = signupUsernameInput.getText().toString();
        String email = signupEmailInput.getText().toString();
        String password = signupPasswordInput.getText().toString();
        String reEnterPassword = signupReEnterPasswordInput.getText().toString();

        // TODO: Implement your own signup logic here.

        DataService dataService = DataService.getInstance();
        User user = dataService.signup(email, password, username);

        if(user == null) {
            onSignupFailed();
            return;
        }

        final ProgressDialog progressDialog = new ProgressDialog(SignupActivity.this,
                R.style.AppTheme);
        progressDialog.setIndeterminate(true);
        progressDialog.setMessage("Creating Account...");
        progressDialog.show();

        new android.os.Handler().postDelayed(
                new Runnable() {
                    public void run() {
                        // On complete call either onSignupSuccess or onSignupFailed
                        // depending on success
                        onSignupSuccess();
                        // onSignupFailed();
                        progressDialog.dismiss();
                    }
                }, 3000);
    }

    public void onSignupSuccess() {
        btnSignup.setEnabled(true);
        Intent intent = new Intent(SignupActivity.this, ModeSelectActivity.class);
        startActivity(intent);
    }

    public void onSignupFailed() {
        Toast.makeText(getBaseContext(), "Login failed", Toast.LENGTH_LONG).show();

        btnSignup.setEnabled(true);
    }

    public boolean validate() {
        boolean valid = true;

        String name = signupUsernameInput.getText().toString();
        String email = signupEmailInput.getText().toString();
        String password = signupPasswordInput.getText().toString();
        String reEnterPassword = signupReEnterPasswordInput.getText().toString();

        if (name.isEmpty() || name.length() < 3) {
            signupUsernameInput.setError("at least 3 characters");
            valid = false;
        } else {
            signupUsernameInput.setError(null);
        }


        if (email.isEmpty() || !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            signupEmailInput.setError("enter a valid email address");
            valid = false;
        } else {
            signupEmailInput.setError(null);
        }


        if (password.isEmpty() || password.length() < 4 || password.length() > 10) {
            signupPasswordInput.setError("between 4 and 10 alphanumeric characters");
            valid = false;
        } else {
            signupPasswordInput.setError(null);
        }

        if (reEnterPassword.isEmpty() || reEnterPassword.length() < 4 || reEnterPassword.length() > 10 || !(reEnterPassword.equals(password))) {
            signupReEnterPasswordInput.setError("Password Do not match");
            valid = false;
        } else {
            signupReEnterPasswordInput.setError(null);
        }

        return valid;
    }

}
