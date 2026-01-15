import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigEntity } from '../../entities/config.entity';
import { isTruthy, isFalsy } from '../../utils/boolean-helpers';

export interface ConfigOptions {
  throwIfNotFound?: boolean;
}

@Injectable()
export class ConfigService {
  private readonly logger = new Logger(ConfigService.name);

  constructor(
    @InjectRepository(ConfigEntity)
    private readonly configRepository: Repository<ConfigEntity>,
  ) {}

  /**
   * Retrieves a configuration value by key
   * @param key - The configuration key to retrieve
   * @returns The configuration value, or undefined if not found
   * @example
   * ```typescript
   * const appName = await configService.get('APP_NAME');
   * // Returns: 'NestJS Template' or undefined
   * ```
   */
  async get(key: string): Promise<string | undefined> {
    const config = await this.configRepository.findOne({
      where: { key },
    });

    return config?.value;
  }

  /**
   * Retrieves a configuration value by key, throwing an error if not found
   * @param key - The configuration key to retrieve
   * @param defaultValue - Optional default value to return if key is not found
   * @param options - Optional configuration options
   * @returns The configuration value or defaultValue if provided
   * @throws {NotFoundException} If the configuration key is not found and no defaultValue is provided
   * @example
   * ```typescript
   * const appName = await configService.getOrFail('APP_NAME');
   * // Returns: 'NestJS Template'
   * // Throws NotFoundException if key doesn't exist
   *
   * const appName = await configService.getOrFail('APP_NAME', 'Default Name');
   * // Returns: 'NestJS Template' or 'Default Name' if not found
   * ```
   */
  async getOrFail(
    key: string,
    defaultValue?: string,
    options?: ConfigOptions,
  ): Promise<string> {
    const config = await this.configRepository.findOne({
      where: { key },
    });

    if (!config) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      if (options?.throwIfNotFound !== false) {
        throw new NotFoundException(`Configuration key '${key}' not found`);
      }
      throw new NotFoundException(`Configuration key '${key}' not found`);
    }

    return config.value;
  }

  /**
   * Sets or updates a configuration value
   * @param key - The configuration key to set
   * @param value - The value to set for the configuration key
   * @returns The created or updated configuration entity
   * @example
   * ```typescript
   * await configService.set('APP_NAME', 'My New App Name');
   * ```
   */
  async set(key: string, value: string): Promise<ConfigEntity> {
    let config = await this.configRepository.findOne({
      where: { key },
    });

    if (config) {
      config.value = value;
      await this.configRepository.save(config);
      this.logger.log(`Updated configuration key '${key}'`);
    } else {
      config = this.configRepository.create({ key, value });
      config = await this.configRepository.save(config);
      this.logger.log(`Created configuration key '${key}'`);
    }

    return config;
  }

  /**
   * Deletes a configuration entry by key
   * @param key - The configuration key to delete
   * @returns True if the configuration was deleted, false if it didn't exist
   * @example
   * ```typescript
   * const deleted = await configService.delete('APP_NAME');
   * // Returns: true if deleted, false if not found
   * ```
   */
  async delete<T extends string>(key: T): Promise<boolean> {
    const result = await this.configRepository.delete({ key });

    if (result.affected && result.affected > 0) {
      this.logger.log(`Deleted configuration key '${key}'`);
      return true;
    }

    this.logger.warn(`Configuration key '${key}' not found for deletion`);
    return false;
  }

  /**
   * Checks if a feature config key is truthy
   * This is a step away from every config defining and checking its own truth value
   * @param key - The configuration key to check
   * @param defaultValue - Optional default value to use if key is not found
   * @param options - Optional configuration options
   * @returns True if the configuration value is truthy, false otherwise
   * @example
   * ```typescript
   * const isEnabled = await configService.isConfigTruthy('FEATURE_ENABLED');
   * // Returns: true if value is 'true', 'TRUE', 'on', 'yes', or '1'
   *
   * const isEnabled = await configService.isConfigTruthy('FEATURE_ENABLED', 'false');
   * // Returns: false (uses default value if key not found)
   * ```
   */
  async isConfigTruthy(
    key: string,
    defaultValue?: string,
    options?: ConfigOptions,
  ): Promise<boolean> {
    const value = await this.getOrFail(key, defaultValue, options);
    return isTruthy(value);
  }

  /**
   * Checks if a feature config key is falsy
   * @param key - The configuration key to check
   * @param defaultValue - Optional default value to use if key is not found
   * @param options - Optional configuration options
   * @returns True if the configuration value is falsy, false otherwise
   * @example
   * ```typescript
   * const isDisabled = await configService.isConfigFalsy('FEATURE_ENABLED');
   * // Returns: true if value is 'false', 'FALSE', 'off', 'no', or '0'
   *
   * const isDisabled = await configService.isConfigFalsy('FEATURE_ENABLED', 'true');
   * // Returns: false (uses default value if key not found)
   * ```
   */
  async isConfigFalsy(
    key: string,
    defaultValue?: string,
    options?: ConfigOptions,
  ): Promise<boolean> {
    const value = await this.getOrFail(key, defaultValue, options);
    return isFalsy(value);
  }
}
