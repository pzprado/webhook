import { Bot as Grammy, InlineKeyboard } from "../deps.ts";

const env = Deno.env.toObject();

export class Bot {
  private _channels: (string | number)[] = [];
  private _instance: Grammy;

  constructor(token: string = env["TOKEN"], channel: string = "") {
    if (!token) {
      throw new Error("No token provided");
    } else {
      this._instance = new Grammy(token);
    }

    if (channel) {
      this._channels.push(channel);
    }

    if (env["WEBHOOK"]) {
      this._channels.push(env["WEBHOOK"]!);
    }
  }

  public addChannel(channel: string | number) {
    this._channels.push(channel);
  }

  /**
   * Send a message to a channel
   * @param channel Channel to send notification
   * @param message Message to deliver to the channel
   * @param link Some link to attach to the message
   * @returns void
   */
  public async send(channel: string | number, message: string, topic: number, link?: string) {
    if (!link) {
      return await this._instance.api.sendMessage(channel, message, topic, {
        parse_mode: "HTML",
      });
    } else {
      return await this._instance.api.sendMessage(channel, message, topic, {
        parse_mode: "HTML",
        reply_markup: new InlineKeyboard().url("View it on GitHub", link),
      });
    }
  }

  /**
   * Send a message to all channels
   * @param message Message to deliver to the channel
   * @param link Some link to attach to the message
   */
  public async push(message: string, topic = 229, link = "") {
    for (const channel of this._channels) {
      await this.send(channel, message, topic, link);
      console.log(channel, message, topic, link);
    }
  }
}

export default new Bot();
