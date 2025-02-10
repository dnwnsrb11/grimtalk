import { create } from 'zustand';

export const useLiveStore = create((set) => ({
  room: null,
  roomName: '',
  participantName: '',
  localTrack: null,
  remoteTracks: [],
  roomCreator: null,
  rtcToken: '',
  chatToken: '',
  availableRooms: [],

  setRoom: (room) => set({ room }),
  setRoomName: (name) => set({ roomName: name }),
  setParticipantName: (name) => set({ participantName: name }),
  setLocalTrack: (track) => set({ localTrack: track }),
  setRemoteTracks: (tracks) => set({ remoteTracks: tracks }),
  addRemoteTrack: (track) =>
    set((state) => ({
      remoteTracks: [...state.remoteTracks, track],
    })),
  removeRemoteTrack: (trackSid) =>
    set((state) => ({
      remoteTracks: state.remoteTracks.filter((t) => t.trackPublication.trackSid !== trackSid),
    })),
  setRoomCreator: (creator) => set({ roomCreator: creator }),
  setTokens: (rtc, chat) => set({ rtcToken: rtc, chatToken: chat }),
  setAvailableRooms: (rooms) => set({ availableRooms: rooms }),

  reset: () =>
    set({
      room: null,
      localTrack: null,
      remoteTracks: [],
      roomCreator: null,
      rtcToken: '',
      chatToken: '',
    }),
}));
