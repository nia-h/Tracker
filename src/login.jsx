<div class="sign-in-view">
  <div class="title">Sign In</div>
  <form
    className="flex flex-col items-center justify-center space-y-3 md:mb-24 md:flex-row md:justify-end md:space-x-4 md:space-y-0"
    onSubmit={handleSubmit}
  >
    <div className="">
      <label htmlFor="email-register" className="">
        <small>Email</small>
      </label>
      <input
        onChange={(e) => setEmail(e.target.value)}
        id="email-register"
        name="email"
        className=""
        type="text"
        placeholder="you@example.com"
        autoComplete="off"
      />
    </div>
    <div className="form-group">
      <label htmlFor="password-register" className="">
        <small>Password</small>
      </label>
      <input
        onChange={(e) => setPassword(e.target.value)}
        id="password-register"
        name="password"
        className=""
        type="password"
        placeholder="Create a password"
      />
    </div>
    <button
      type="submit"
      className="w-1/4 rounded-lg bg-secondary text-white transition-all  duration-150 hover:border-b-0 hover:border-t-8 hover:bg-primary hover:shadow-lg"
    >
      Sign In
    </button>
  </form>
  <div class="form-header">
    <div class="sign-in-divider">
      <span>or</span>
    </div>
    <div class="social-buttons">
      <div
        class="google social-button "
        data-ember-action=""
        data-ember-action-509="509"
      >
        <div class="google-image">
          <img src="https://accounts.ucraft.com/assets/img/google-icon.png" />
        </div>
        <span class="social-button-text google-button-text">
          Sign in with Google
        </span>
      </div>
    </div>
  </div>
</div>;
