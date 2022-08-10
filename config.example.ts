import { NodeOptions } from 'vulkava'

export default {
  token: "YOUR BOT TOKEN GOES HERE",
  enviroment: "prod",
  nodes: [{
    id: "Node 01",
    hostname: 'localhost',
    password: "youshallnotpass",
    port: 433
  }] as NodeOptions[]
}