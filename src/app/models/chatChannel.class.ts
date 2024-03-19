export class ChatChannel {
  relatedChannelId: string;
  messages: {
    answerto: string;
    message: string;
    timestamp: number;
    userId: string;
    emoji: {
      icon: string;
      userId: string;
    }[];
  }[];
 

  constructor(obj?: any) {
    this.relatedChannelId = obj ? obj.relatedChannelId : '';
    this.messages = obj && obj.messages ? obj.messages : [
            {
              answerto: '',
              message: '',
              timestamp: 0,
              userId: '',
              emoji: [{icon: '', userId: [] as any[], iconId: '' },],
            },
          ];
    this.sortMessagesByTimestamp();
  }

  sortMessagesByTimestamp() {
    this.messages.sort((a, b) => a.timestamp - b.timestamp);
  }
}
