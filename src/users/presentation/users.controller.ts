import { Body, Controller, Get, Patch } from '@nestjs/common';
import type { AuthenticatedUser } from '../../auth/authenticated-user';
import { CurrentUser } from '../../auth/presentation/current-user.decorator';
import { GetMyPreferences } from '../application/get-my-preferences';
import { UpdateMyPreferences } from '../application/update-my-preferences';
import { UpdatePreferencesDto } from './update-preferences.dto';

@Controller('me/preferences')
export class UsersController {
  constructor(
    private readonly getPreferences: GetMyPreferences,
    private readonly updatePreferences: UpdateMyPreferences,
  ) {}

  @Get()
  get(@CurrentUser() user: AuthenticatedUser) {
    return this.getPreferences.execute(user.id);
  }

  @Patch()
  update(@Body() dto: UpdatePreferencesDto, @CurrentUser() user: AuthenticatedUser) {
    return this.updatePreferences.execute(user.id, dto);
  }
}