export type User = {
  _id: string;
  username: string;
  email: string;
  full_name: string;
  roles: any;
  avatarFile: AvatarFile;
};

export type Scan = {
  _id: string;
  title: string;
  description: string;
  status: number;
  is_visible: boolean;
  created_at: Date;
  updated_at: Date;
  user: User;
  scanFiles: ScanFile[];
};

export type ScanFile = {
  _id: string;
  original_filename: string;
  current_filename: string;
  status: number;
  position: number;
  category: string;
  orientation: string;
};

export type AvatarFile = {
  _id: string;
  original_filename: string;
  current_filename: string;
};

export type CommentType = {
  _id: string;
  content: string;
  created_at: Date;
  parent: CommentType;
  replies: CommentType[];
  scan: Scan;
  author: User;
};

export type NotificationType = {
  _id: string;
  message: string;
  url: string;
  channel: string;
  target: object;
  created_at: Date;
  read_at: Date;
  user: User;
};

export type FlashMessage = {
  status: number;
  message: string;
  success: boolean;
};

export type Props = { [key: string]: any };
