import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { backendUrl } from "../axios";
import { useNavigate } from "react-router-dom";

interface LoginFormInputs {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    setLoading(true);
    backendUrl.post('login', data, {
        headers: {
            'Content-Type': "application/json"
        }
    })
        .then(response => {
            console.log(response);
            if (response.status == 200) {
                localStorage.setItem('token', response.data?.token)
                navigate('/')
            }
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {setLoading(false);})
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "150px auto",
        padding: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h5" component="h1" textAlign="center" marginBottom={2}>
        Login
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>

        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register("username", {
            required: "username kiritish majburiy",

          })}
          error={!!errors.username}
          helperText={errors.username?.message}
        />

        <TextField
          label="Parol"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          {...register("password", {
            required: "Parol kiritish majburiy",
            minLength: {
              value: 4,
              message: "Parol kamida 6 ta belgidan iborat bo‘lishi kerak",
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
          disabled = {loading}
        >
          {loading ? "Kutilmoqda..." : "Kirish"}
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage;
