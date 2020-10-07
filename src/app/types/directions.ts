export enum Direction {
	Up,
	Down,
	Left,
	Right
};

export type ElevatorDir = Direction.Up | Direction.Down;

export interface DirectionEventArg<T> {
	item: T,
	direction: ElevatorDir,
};