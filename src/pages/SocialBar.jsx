import Theme from "../hooks/utils/Theme";
import {
  AiFillAlipayCircle,
  AiFillApi,
  AiFillApple,
  AiFillAppstore,
  AiFillBilibili,
} from "react-icons/ai";
import { Link } from "react-router-dom";

const SocialBar = () => {
  // console.log(localStorage.getItem("theme"), localStorage.theme) === "dark";
  return (
    <div>
      <div className="sidebar-social">
        <div className=" ">
          <Link to={"/"}>
            <NavIcon icons={<AiFillApi />} name="htoomyatnyinyi@gmail.com" />
          </Link>
          <NavIcon icons={<AiFillAppstore />} name="FacebookAddress" />
          <NavIcon
            icons={<AiFillBilibili />}
            name="https://github.com/htoomyatnyinyi/projects"
          />
          <NavIcon icons={<AiFillApple />} name="+959792400340" />
          {/* <NavIcon icons={<Theme />} name="ChangeTheme" /> */}
        </div>
        <Theme />
      </div>
    </div>
  );
};

const NavIcon = ({ icons, name }) => {
  return (
    <div className="icon-style group">
      {icons}
      <span className="icon-name group-hover:scale-100">{name}</span>
    </div>
  );
};
export default SocialBar;
