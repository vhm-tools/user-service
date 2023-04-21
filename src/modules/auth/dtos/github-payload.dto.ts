import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

class EmailAddress {
  @IsEmail()
  value: string;
}

class GithubProfile {
  id: string;
  displayName: string;
  username: string;
  profileUrl: string;
  provider: string;
  photos: Array<{ value: string }>;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  emails: Array<EmailAddress>;
}

export class GithubPayload {
  @IsString()
  accessToken: string;

  @IsObject()
  profile: GithubProfile;
}
