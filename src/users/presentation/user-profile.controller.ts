import { Body, Controller, Delete, Get, HttpCode, Patch } from '@nestjs/common';
import type { AuthenticatedUser } from '../../auth/authenticated-user';
import { CurrentUser } from '../../auth/presentation/current-user.decorator';
import { GetMyProfile } from '../application/get-my-profile';
import { UpdateMyProfile } from '../application/update-my-profile';
import { DeleteMyAccount } from '../application/delete-my-account';
import { UpdateProfileDto } from './update-profile.dto';

@Controller('me')
export class UserProfileController {
  constructor(
    private readonly getProfile: GetMyProfile,
    private readonly updateProfile: UpdateMyProfile,
    private readonly deleteAccount: DeleteMyAccount,
  ) {}

  @Get()
  get(@CurrentUser() user: AuthenticatedUser) {
    return this.getProfile.execute(user.id);
  }

  @Patch()
  update(@Body() dto: UpdateProfileDto, @CurrentUser() user: AuthenticatedUser) {
    return this.updateProfile.execute(user.id, dto);
  }

  @Delete()
  @HttpCode(204)
  async remove(@CurrentUser() user: AuthenticatedUser) {
    await this.deleteAccount.execute(user.id);
  }
}