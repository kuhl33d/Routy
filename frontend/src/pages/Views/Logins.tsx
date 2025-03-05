import { useUserStore } from "@/stores/user.store";

const Logins = () => {
  const { login } = useUserStore();
  return (
    <div>
      <p>Login As</p>
      <button
        className="button"
        onClick={() => {
          login({ email: "Mohamed@admin.com", password: "123456" });
        }}
      >
        Admin
      </button>
      <button
        onClick={() => {
          login({ email: "Mohamed@Driver.com", password: "123456" });
        }}
      >
        Driver
      </button>
      <button
        onClick={() => {
          login({ email: "mohamed@parent.com", password: "123456" });
        }}
      >
        Parent
      </button>
      <button
        onClick={() => {
          login({ email: "Mohamed@Student.com", password: "123456" });
        }}
      >
        Student
      </button>
    </div>
  );
};

export default Logins;
