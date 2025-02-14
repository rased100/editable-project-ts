import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { z } from "zod";
import _ from "@lodash";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import useJwtAuth from "../useJwtAuth";
import { Typography } from "@mui/material";
/**
 * Form Validation Schema
 */
const schema = z.object({
  email: z
    .string()
    .email("You must enter a valid email")
    .nonempty("You must enter an email"),
  password: z
    .string()
    .min(4, "Password is too short - must be at least 4 chars.")
    .nonempty("Please enter your password."),
});
const defaultValues = {
  email: "",
  password: "",
  remember: true,
};

function JwtSignInForm() {
  const { signIn } = useJwtAuth();
  const { control, formState, handleSubmit, setValue, setError } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: zodResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;
  useEffect(() => {
    setValue("email", "admin@fusetheme.com", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("password", "admin", { shouldDirty: true, shouldValidate: true });
  }, [setValue]);

  function onSubmit(formData) {
    const { email, password } = formData;
    signIn({
      email,
      password,
    }).catch((error) => {
      const errorData = error.response.data;
      errorData.forEach((err) => {
        setError(err.type, {
          type: "manual",
          message: err.message,
        });
      });
    });
  }

  return (
    <form
      name="loginForm"
      noValidate
      className="mt-32 flex w-full flex-col justify-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-24"
            label="Your Email"
            autoFocus
            type="email"
            error={!!errors.email}
            helperText={errors?.email?.message}
            variant="outlined"
            required
            fullWidth
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mb-24"
            label="Password"
            type="password"
            error={!!errors.password}
            helperText={errors?.password?.message}
            variant="outlined"
            required
            fullWidth
          />
        )}
      />

      <div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">
        {/* <Controller
          name="remember"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormControlLabel
                label="Remember me"
                control={<Checkbox size="small" {...field} />}
              />
            </FormControl>
          )}
        /> */}
        <Typography>
          Forgot your password?{" "}
          <Link
            className="text-md font-medium"
            to="/pages/auth/forgot-password"
          >
            Click here
          </Link>
        </Typography>
      </div>

      <Button
        variant="contained"
        color="primary"
        className=" mt-16 w-full"
        aria-label="Sign in"
        disabled={_.isEmpty(dirtyFields) || !isValid}
        type="submit"
        size="large"
      >
        Log in
      </Button>
    </form>
  );
}

export default JwtSignInForm;
