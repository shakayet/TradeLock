declare namespace NodeJS {
  type Global = {
    io?: import('socket.io').Server;
  }
}

export {};
