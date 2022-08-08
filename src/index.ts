require("dotenv").config();
import { Siesta } from "./structures/Client";

export const client = new Siesta();

client.init();

