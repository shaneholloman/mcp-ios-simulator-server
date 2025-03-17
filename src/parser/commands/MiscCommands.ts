// SPDX-FileCopyrightText: © 2025 Industria de Diseño Textil S.A. INDITEX
// SPDX-License-Identifier: APACHE-2.0

import { BaseCommandDefinition, CommandDefinition } from './BaseCommandDefinition.js';

export class MiscCommands extends BaseCommandDefinition {
  protected definitions: CommandDefinition[] = [
    {
      command: 'install dylib',
      patterns: [
        /instalar\s+dylib\s+(?<dylibPath>[^\s,]+)/i,
        /install\s+dylib\s+(?<dylibPath>[^\s,]+)/i,
        /add\s+dylib\s+(?<dylibPath>[^\s,]+)/i,
        /load\s+dylib\s+(?<dylibPath>[^\s,]+)/i
      ],
      description: 'Installs a dynamic library (.dylib)',
      requiredParameters: ['dylibPath'],
      optionalParameters: ['sessionId'],
      examples: [
        'instalar dylib /ruta/a/lib.dylib',
        'install dylib /tmp/library.dylib',
        'add dylib /path/to/lib.dylib',
        'load dylib /path/to/library.dylib'
      ],
      parameterExtractors: {
        dylibPath: (match) => match.groups?.dylibPath?.trim()
      }
    },
    {
      command: 'open url',
      patterns: [
        /abrir\s+url\s+(?<url>[^\s]+)/i,
        /open\s+url\s+(?<url>[^\s]+)/i,
        /navegar\s+a\s+(?<url>[^\s]+)/i,
        /navigate\s+to\s+(?<url>[^\s]+)/i,
        /browse\s+to\s+(?<url>[^\s]+)/i
      ],
      description: 'Opens a URL in the simulator',
      requiredParameters: ['url'],
      optionalParameters: ['sessionId'],
      examples: [
        'abrir url https://example.com',
        'open url https://google.com',
        'navegar a https://apple.com',
        'navigate to https://example.com',
        'browse to https://apple.com'
      ],
      parameterExtractors: {
        url: (match) => match.groups?.url?.trim()
      }
    },
    {
      command: 'clear keychain',
      patterns: [
        /limpiar\s+keychain/i,
        /clear\s+keychain/i,
        /borrar\s+keychain/i,
        /reset\s+keychain/i,
        /empty\s+keychain/i
      ],
      description: 'Clears the simulator keychain',
      requiredParameters: [],
      optionalParameters: ['sessionId'],
      examples: [
        'limpiar keychain',
        'clear keychain',
        'borrar keychain',
        'reset keychain',
        'empty keychain'
      ],
      parameterExtractors: {}
    },
    {
      command: 'set location',
      patterns: [
        /establecer\s+ubicación\s+(?<latitude>-?\d+(\.\d+)?)\s*,\s*(?<longitude>-?\d+(\.\d+)?)/i,
        /set\s+location\s+(?<latitude>-?\d+(\.\d+)?)\s*,\s*(?<longitude>-?\d+(\.\d+)?)/i,
        /cambiar\s+ubicación\s+a\s+(?<latitude>-?\d+(\.\d+)?)\s*,\s*(?<longitude>-?\d+(\.\d+)?)/i,
        /update\s+location\s+(?<latitude>-?\d+(\.\d+)?)\s*,\s*(?<longitude>-?\d+(\.\d+)?)/i,
        /change\s+location\s+to\s+(?<latitude>-?\d+(\.\d+)?)\s*,\s*(?<longitude>-?\d+(\.\d+)?)/i
      ],
      description: 'Sets the simulator location',
      requiredParameters: ['latitude', 'longitude'],
      optionalParameters: ['sessionId'],
      examples: [
        'establecer ubicación 37.7749, -122.4194',
        'set location 40.7128, -74.0060',
        'cambiar ubicación a 51.5074, -0.1278',
        'update location 48.8566, 2.3522',
        'change location to 35.6762, 139.6503'
      ],
      parameterExtractors: {
        latitude: (match) => parseFloat(match.groups?.latitude || '0'),
        longitude: (match) => parseFloat(match.groups?.longitude || '0')
      }
    },
    {
      command: 'add media',
      patterns: [
        /añadir\s+media\s+(?<mediaPaths>.+)/i,
        /add\s+media\s+(?<mediaPaths>.+)/i,
        /importar\s+multimedia\s+(?<mediaPaths>.+)/i,
        /import\s+media\s+(?<mediaPaths>.+)/i,
        /upload\s+media\s+(?<mediaPaths>.+)/i
      ],
      description: 'Adds media files to the simulator camera roll',
      requiredParameters: ['mediaPaths'],
      optionalParameters: ['sessionId'],
      examples: [
        'añadir media /ruta/imagen.jpg /ruta/video.mp4',
        'add media /tmp/photo.png',
        'importar multimedia /ruta/a/fotos/*.jpg',
        'import media /path/to/photos/*.jpg',
        'upload media /path/video.mp4'
      ],
      parameterExtractors: {
        mediaPaths: (match) => match.groups?.mediaPaths?.trim().split(/\s+/)
      }
    },
    {
      command: 'approve permissions',
      patterns: [
        /aprobar\s+permisos\s+(?<bundleId>[^\s,]+)\s+(?<permissions>.+)/i,
        /approve\s+permissions\s+(?<bundleId>[^\s,]+)\s+(?<permissions>.+)/i,
        /dar\s+permisos\s+a\s+(?<bundleId>[^\s,]+)\s+(?<permissions>.+)/i,
        /grant\s+permissions\s+(?<bundleId>[^\s,]+)\s+(?<permissions>.+)/i,
        /allow\s+permissions\s+(?<bundleId>[^\s,]+)\s+(?<permissions>.+)/i
      ],
      description: 'Approves permissions for an application',
      requiredParameters: ['bundleId', 'permissions'],
      optionalParameters: ['sessionId'],
      examples: [
        'aprobar permisos com.example.app photos camera',
        'approve permissions com.apple.mobilesafari contacts',
        'dar permisos a com.example.app photos',
        'grant permissions com.example.app camera',
        'allow permissions com.example.app location'
      ],
      parameterExtractors: {
        bundleId: (match) => match.groups?.bundleId?.trim(),
        permissions: (match) => match.groups?.permissions?.trim().split(/\s+/)
      }
    },
    {
      command: 'update contacts',
      patterns: [
        /actualizar\s+contactos\s+(?<dbPath>[^\s,]+)/i,
        /update\s+contacts\s+(?<dbPath>[^\s,]+)/i,
        /importar\s+contactos\s+(?<dbPath>[^\s,]+)/i,
        /import\s+contacts\s+(?<dbPath>[^\s,]+)/i,
        /load\s+contacts\s+(?<dbPath>[^\s,]+)/i
      ],
      description: 'Updates the simulator contacts database',
      requiredParameters: ['dbPath'],
      optionalParameters: ['sessionId'],
      examples: [
        'actualizar contactos /ruta/a/contactos.sqlite',
        'update contacts /tmp/contacts.db',
        'importar contactos /ruta/contacts.sqlite',
        'import contacts /path/to/contacts.db',
        'load contacts /path/contacts.sqlite'
      ],
      parameterExtractors: {
        dbPath: (match) => match.groups?.dbPath?.trim()
      }
    }
  ];
}
