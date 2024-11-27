const font = "Slant";
const root = "~";
let cwd = root;
const user = "guest";
const server = "eddygergi.github.io";
const url = "https://v2.jokeapi.dev/joke/Programming";

const dirs = ["education", "projects", "skills"];
const files = ["joke", "resume", "contact"];

const commands = {
  cd(dir = null) {
    if (dir === null || (dir === ".." && cwd !== root)) {
      cwd = root;
    } else if (dir.startsWith("~/") && dirs.includes(dir.substring(2))) {
      cwd = dir;
    } else if (dirs.includes(dir)) {
      cwd = root + "/" + dir;
    } else {
      this.error("Wrong directory");
    }
  },
  ls(dir = null) {
    if (dir) {
      if (dir.match(/^~\/?$/)) {
        print_home();
      } else if (dir.startsWith("~/")) {
        const path = dir.substring(2);
        const dirs = path.split("/");
        if (dirs.length > 1) {
          this.error("Invalid directory");
        } else {
          const dir = dirs[0];
          if (directories[dir]) {
            this.echo(directories[dir].join("\n"));
          } else if (files.includes(dir)) {
            this.echo(`<green class="command">${dir}</green>`);
          } else {
            this.error("Invalid directory or file");
          }
        }
      } else if (cwd === root) {
        print_home();
      } else {
        const dir = cwd.substring(2);
        if (directories[dir]) {
          this.echo(directories[dir].join("\n"));
        } else if (files.includes(dir)) {
          this.echo(`<green class="command">${dir}</green>`);
        } else {
          this.error("Invalid directory or file");
        }
      }
    } else if (cwd === root) {
      print_home();
    } else {
      const dir = cwd.substring(2);
      if (directories[dir]) {
        this.echo(directories[dir].join("\n"));
      } else if (files.includes(dir)) {
        this.echo(`<green class="command">${dir}</green>`);
      }
    }
  },
  async joke() {
    const res = await fetch(url);
    const data = await res.json();
    if (data.type == "twopart") {
      this.animation(async () => {
        await this.echo(`Q: ${data.setup}`, {
          delay: 50,
          typing: true,
        });
        await this.echo(`A: ${data.delivery}`, {
          delay: 50,
          typing: true,
        });
      });
    } else if (data.type === "single") {
      this.echo(data.joke, {
        delay: 50,
        typing: true,
      });
    }
  },
  resume() {
    this.echo("Downloading Resume...", { delay: 50 });
    window.location.href = "assets/resume/Resume_EddyGergi.pdf"; 
  },
  contact() {
    this.echo("Redirecting to email...", { delay: 50 });
    window.location.href = "mailto:imeddygergi@gmail.com"; 
  },
};

const directories = {
  education: [
    "",
    "<white>education && certifications</white>",
    "* <p> Lebanese University - Faculty of Sciences II </p> <yellow>BS in Computer Science</p>",
    "* <p> AWS Certified SysOps Administrator - Associate </p>",
    "* <p> AWS Certified Cloud Practitioner - Foundational </p>",
    "",
  ],
  projects: [
    "",
    "<white>My Projects</white>",
    [
      [
        "LibraFlick",
        "https://github.com/theddygergi/project-dotnet-libraflick",
        "library management system with react.js and asp.net",
      ],
      [
        "Python CLI Games",
        "https://github.com/theddygergi/BasicPythonGames",
        "Popular python games interacted with using CLI",
      ],
      [
        "Final Year Project(Confidential)",
        " ",
        "A python script for copyright infringements on social media",
      ],
    ].map(([name, url, description = ""]) => {
      return `* <a href="${url}">${name}</a> &mdash; <white>${description}</white>`;
    }),
    "",
  ].flat(),
  skills: [
    "",
    "<white>languages</white>",
    ["JavaScript", "Python", "SQL", "C/C++", "C#(.NET)", "Bash"].map(
      (lang) => `* <yellow>${lang}</yellow>`
    ),
    "",
    "<white>libraries</white>",
    ["React.js", "Node.js", "Express"].map((lib) => `* <green>${lib}</green>`),
    "",
    "<white>tools</white>",
    ["Docker", "git", "GNU/Linux", "AWS Management Console"].map(
      (lib) => `* <blue>${lib}</blue>`
    ),
    "",
  ].flat(),
};

const formatter = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});

const command_list = ["clear"].concat(Object.keys(commands));
const formatted_list = command_list.map(
  (cmd) => `<white class="command">${cmd}</white>`
);
const help = formatter.format(command_list);

$.terminal.new_formatter([
  new RegExp(`^\\s*(${dirs.join("|")})`),
  function (_, command, args) {
    return `<white>${command}</white><aqua>${args}</aqua>`;
  },
]);

figlet.defaults({ fontPath: "https://unpkg.com/figlet/fonts/" });
figlet.preloadFonts([font], ready);

const term = $("body").terminal(commands, {
  greetings: false,
  checkArity: false,
  completion(string) {
    const cmd = this.get_command();
    const { name, rest } = $.terminal.parse_command(cmd);
    if (["cd", "ls"].includes(name)) {
      if (rest.startsWith("~/")) {
        return dirs.map((dir) => `~/${dir}`);
      }
      if (cwd === root) {
        return dirs;
      }
    }
    return Object.keys(commands);
  },
  prompt,
});

term.on("click", ".command", function () {
  const command = $(this).text();
  term.exec(command);
});

term.on("click", ".directory", function () {
  const dir = $(this).text();
  term.exec(`cd ~/${dir}`);
});

term.history_state(false);

function ready() {
  term
    .echo(() => rainbow(render("EDDY GERGI")))
    .echo("<white>Welcome to my Terminal Portfolio</white>\n")
    .resume();
}

function render(text) {
  const cols = term.cols();
  return figlet.textSync(text, {
    font: font,
    width: cols,
    whitespaceBreak: true,
  });
}

function rainbow(string) {
  return lolcat
    .rainbow((char, color) => {
      char = $.terminal.escape_brackets(char);
      return `[[;${hex(color)};]${char}]`;
    }, string)
    .join("\n");
}

function hex(color) {
  return (
    "#" +
    [color.red, color.green, color.blue]
      .map((n) => n.toString(16).padStart(2, "0"))
      .join("")
  );
}

function prompt() {
  return `<green>${user}@${server}</green>:<blue>${cwd}</blue>$ `;
}

function print_home() {
  term.echo(
    dirs
      .map((dir) => {
        return `<blue class="directory">${dir}</blue>`;
      })
      .join("\n")
  );
  term.echo(
    files
      .map((file) => {
        return `<green class="command">${file}</green>`;
      })
      .join("\n")
  );
}
