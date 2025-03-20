// SPDX-FileCopyrightText: © 2025 Industria de Diseño Textil S.A. INDITEX
// SPDX-License-Identifier: Apache-2.0

import { BaseCommandDefinition, CommandDefinition } from './BaseCommandDefinition.js';

export class DebugCommands extends BaseCommandDefinition {
  protected definitions: CommandDefinition[] = [
    {
      command: 'start debug',
      patterns: [
        /iniciar\s+debug\s+(?<bundleId>[^\s,]+)/i,
        /start\s+debug\s+(?<bundleId>[^\s,]+)/i,
        /debug\s+app\s+(?<bundleId>[^\s,]+)/i,
        /begin\s+debug\s+(?<bundleId>[^\s,]+)/i,
        /launch\s+debug\s+(?<bundleId>[^\s,]+)/i
      ],
      description: 'Starts a debug session for an application',
      requiredParameters: ['bundleId'],
      optionalParameters: ['sessionId'],
      examples: [
        'iniciar debug com.example.app',
        'start debug com.apple.mobilesafari',
        'debug app com.example.app',
        'begin debug com.example.app',
        'launch debug com.apple.mobilesafari'
      ],
      parameterExtractors: {
        bundleId: (match) => match.groups?.bundleId?.trim()
      }
    },
    {
      command: 'stop debug',
      patterns: [
        /detener\s+debug/i,
        /parar\s+debug/i,
        /stop\s+debug/i,
        /end\s+debug/i,
        /terminate\s+debug/i
      ],
      description: 'Stops a debug session',
      requiredParameters: [],
      optionalParameters: ['sessionId'],
      examples: [
        'detener debug',
        'parar debug',
        'stop debug',
        'end debug',
        'terminate debug'
      ],
      parameterExtractors: {}
    },
    {
      command: 'debug status',
      patterns: [
        /estado\s+debug/i,
        /status\s+debug/i,
        /información\s+debug/i,
        /debug\s+status/i,
        /get\s+debug\s+status/i
      ],
      description: 'Gets the debug session status',
      requiredParameters: [],
      optionalParameters: ['sessionId'],
      examples: [
        'estado debug',
        'status debug',
        'información debug',
        'debug status',
        'get debug status'
      ],
      parameterExtractors: {}
    },
    {
      command: 'list crash logs',
      patterns: [
        /listar\s+crash\s+logs/i,
        /mostrar\s+crash\s+logs/i,
        /list\s+crash\s+logs/i,
        /show\s+crash\s+logs/i,
        /display\s+crash\s+logs/i
      ],
      description: 'Lists available crash logs',
      requiredParameters: [],
      optionalParameters: ['bundleId', 'sessionId'],
      examples: [
        'listar crash logs',
        'mostrar crash logs',
        'list crash logs',
        'show crash logs',
        'display crash logs'
      ],
      parameterExtractors: {}
    },
    {
      command: 'show crash log',
      patterns: [
        /mostrar\s+crash\s+log\s+(?<crashName>[^\s,]+)/i,
        /ver\s+crash\s+log\s+(?<crashName>[^\s,]+)/i,
        /show\s+crash\s+log\s+(?<crashName>[^\s,]+)/i,
        /display\s+crash\s+log\s+(?<crashName>[^\s,]+)/i,
        /view\s+crash\s+log\s+(?<crashName>[^\s,]+)/i
      ],
      description: 'Gets the content of a crash log',
      requiredParameters: ['crashName'],
      optionalParameters: ['sessionId'],
      examples: [
        'mostrar crash log crash_2023-01-01',
        'ver crash log app_crash_123',
        'show crash log system_crash',
        'display crash log error_log_123',
        'view crash log app_crash_456'
      ],
      parameterExtractors: {
        crashName: (match) => match.groups?.crashName?.trim()
      }
    },
    {
      command: 'delete crash logs',
      patterns: [
        /eliminar\s+crash\s+logs/i,
        /borrar\s+crash\s+logs/i,
        /delete\s+crash\s+logs/i,
        /remove\s+crash\s+logs/i,
        /clear\s+crash\s+logs/i
      ],
      description: 'Deletes crash logs',
      requiredParameters: [],
      optionalParameters: ['bundleId', 'sessionId', 'all'],
      examples: [
        'eliminar crash logs',
        'borrar crash logs',
        'delete crash logs',
        'remove crash logs',
        'clear crash logs'
      ],
      parameterExtractors: {}
    }
  ];
}
