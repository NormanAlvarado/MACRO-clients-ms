import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientPreferences } from './entities/client-preferences.entity';
import { CreateClientPreferencesInput } from './dto/create-client-preferences.input';
import { UpdateClientPreferencesInput } from './dto/update-client-preferences.input';

@Injectable()
export class ClientPreferencesService {
  constructor(
    @InjectRepository(ClientPreferences)
    private preferencesRepository: Repository<ClientPreferences>,
  ) {}

  async create(createPreferencesInput: CreateClientPreferencesInput): Promise<ClientPreferences> {
    const preferences = this.preferencesRepository.create(createPreferencesInput);
    return await this.preferencesRepository.save(preferences);
  }

  async findAll(): Promise<ClientPreferences[]> {
    return await this.preferencesRepository.find({
      relations: ['client'],
    });
  }

  async findOne(id: number): Promise<ClientPreferences> {
    const preferences = await this.preferencesRepository.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!preferences) {
      throw new NotFoundException(`Preferencias con ID ${id} no encontradas`);
    }

    return preferences;
  }

  async findByClientId(clienteId: number): Promise<ClientPreferences | null> {
    return await this.preferencesRepository.findOne({
      where: { cliente_id: clienteId },
      relations: ['client'],
    });
  }

  async update(id: number, updatePreferencesInput: UpdateClientPreferencesInput): Promise<ClientPreferences> {
    const preferences = await this.findOne(id);
    
    Object.assign(preferences, updatePreferencesInput);
    return await this.preferencesRepository.save(preferences);
  }

  async remove(id: number): Promise<ClientPreferences> {
    const preferences = await this.findOne(id);
    await this.preferencesRepository.remove(preferences);
    return preferences;
  }
}
