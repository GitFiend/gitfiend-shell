use std::io::Write;
use std::{env, io};

fn main() {
  if let Some(last_arg) = env::args().last() {
    if let Some(response) = handle_prompt(&last_arg) {
      write_response(response).expect("Panic: Write response failed");
    }
  }
}

fn handle_prompt(prompt: &str) -> Option<String> {
  if prompt.starts_with("Username") {
    env::var("GITFIEND_USERNAME").ok()
  } else if prompt.starts_with("Password") {
    env::var("GITFIEND_PASSWORD").ok()
  } else {
    None
  }
}

fn write_response(response: String) -> io::Result<()> {
  io::stdout().write_all(response.as_ref())?;
  io::stdout().flush()
}
