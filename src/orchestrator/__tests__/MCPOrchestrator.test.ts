import { jest } from '@jest/globals';
import { MCPOrchestrator } from '../MCPOrchestrator.js';
import { IParser, ParseResult, ValidationResult } from '../../parser/interfaces/IParser.js';
import { IIDBManager } from '../../idb/interfaces/IIDBManager.js';
import { CommandType, CommandResult, IOrchestratorCommand } from '../interfaces/IOrchestratorCommand.js';

// Mock implementations
const mockParser: jest.Mocked<IParser> = {
  parseInstruction: jest.fn(),
  validateInstruction: jest.fn(),
  normalizeParameters: jest.fn(),
  getSupportedCommands: jest.fn(),
  suggestCompletions: jest.fn()
};

const mockIDBManager: jest.Mocked<IIDBManager> = {
  // Required simulator management methods
  createSimulatorSession: jest.fn(),
  terminateSimulatorSession: jest.fn(),
  listAvailableSimulators: jest.fn(),
  listBootedSimulators: jest.fn(),
  listSimulatorSessions: jest.fn(),
  bootSimulatorByUDID: jest.fn(),
  shutdownSimulatorByUDID: jest.fn(),
  shutdownSimulator: jest.fn(),
  isSimulatorBooted: jest.fn(),

  // Required app management methods
  installApp: jest.fn(),
  launchApp: jest.fn(),
  terminateApp: jest.fn(),
  isAppInstalled: jest.fn(),

  // Required UI interaction methods
  tap: jest.fn(),
  swipe: jest.fn(),

  // Required screenshots and logs methods
  takeScreenshot: jest.fn(),
  getSystemLogs: jest.fn(),
  getAppLogs: jest.fn()
};

describe('MCPOrchestrator', () => {
  let orchestrator: MCPOrchestrator;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    orchestrator = new MCPOrchestrator(mockParser, mockIDBManager);
  });

  describe('processInstruction', () => {
    it('should process a valid instruction successfully', async () => {
      const instruction = 'lanzar app com.example.app';
      const parseResult: ParseResult = {
        command: 'lanzar app',
        parameters: { bundleId: 'com.example.app' },
        confidence: 1.0,
        originalText: instruction
      };
      const validationResult: ValidationResult = {
        isValid: true
      };

      mockParser.parseInstruction.mockResolvedValue(parseResult);
      mockParser.validateInstruction.mockResolvedValue(validationResult);
      mockParser.normalizeParameters.mockResolvedValue(parseResult);
      mockIDBManager.launchApp.mockResolvedValue();

      const result = await orchestrator.processInstruction(instruction);
      expect(result.success).toBe(true);
      expect(mockParser.parseInstruction).toHaveBeenCalledWith(instruction);
      expect(mockParser.validateInstruction).toHaveBeenCalledWith(parseResult);
      expect(mockParser.normalizeParameters).toHaveBeenCalledWith(parseResult);
    });

    it('should handle invalid instructions', async () => {
      const instruction = 'invalid command';
      const parseResult: ParseResult = {
        command: 'unknown',
        parameters: {},
        confidence: 0.0,
        originalText: instruction
      };
      const validationResult: ValidationResult = {
        isValid: false,
        errorMessage: 'Invalid command'
      };

      mockParser.parseInstruction.mockResolvedValue(parseResult);
      mockParser.validateInstruction.mockResolvedValue(validationResult);

      const result = await orchestrator.processInstruction(instruction);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid command');
    });
  });

  describe('executeCommand', () => {
    it('should execute a simple command successfully', async () => {
      const command: IOrchestratorCommand = {
        type: CommandType.LAUNCH_APP,
        parameters: { bundleId: 'com.example.app' },
        id: '123',
        description: 'Launch app'
      };

      mockIDBManager.launchApp.mockResolvedValue();

      const result = await orchestrator.executeCommand(command);
      expect(result.success).toBe(true);
    });

    it('should execute a sequence command', async () => {
      const command: IOrchestratorCommand = {
        type: CommandType.SEQUENCE,
        parameters: {
          commands: [
            {
              type: CommandType.LAUNCH_APP,
              parameters: { bundleId: 'com.example.app' },
              id: '123',
              description: 'Launch app'
            },
            {
              type: CommandType.TAP,
              parameters: { x: 100, y: 200 },
              id: '456',
              description: 'Tap screen'
            }
          ],
          stopOnError: true
        },
        id: '789',
        description: 'Sequence command'
      };

      mockIDBManager.launchApp.mockResolvedValue();
      mockIDBManager.tap.mockResolvedValue();

      const result = await orchestrator.executeCommand(command);
      expect(result.success).toBe(true);
      expect(mockIDBManager.launchApp).toHaveBeenCalled();
      expect(mockIDBManager.tap).toHaveBeenCalled();
    });
  });

  describe('session management', () => {
    it('should manage session ID correctly', () => {
      const sessionId = 'test-session-123';
      orchestrator.setActiveSessionId(sessionId);
      expect(orchestrator.getActiveSessionId()).toBe(sessionId);

      orchestrator.setActiveSessionId(null);
      expect(orchestrator.getActiveSessionId()).toBeNull();
    });

    it('should update session ID after creating a simulator session', async () => {
      const command: IOrchestratorCommand = {
        type: CommandType.CREATE_SIMULATOR_SESSION,
        parameters: { udid: 'test-simulator' },
        id: '123',
        description: 'Create simulator session'
      };

      mockIDBManager.createSimulatorSession.mockResolvedValue('new-session-123');

      const result = await orchestrator.executeCommand(command);
      expect(result.success).toBe(true);
      expect(orchestrator.getActiveSessionId()).toBe('new-session-123');
    });
  });

  describe('command history', () => {
    it('should maintain command history', async () => {
      const command: IOrchestratorCommand = {
        type: CommandType.LAUNCH_APP,
        parameters: { bundleId: 'com.example.app' },
        id: '123',
        description: 'Launch app'
      };

      mockIDBManager.launchApp.mockResolvedValue();

      await orchestrator.executeCommand(command);
      const history = orchestrator.getCommandHistory();
      
      expect(history.length).toBe(1);
      expect(history[0].command).toEqual(command);
      expect(history[0].result.success).toBe(true);
    });

    it('should respect history limit', async () => {
      const command1: IOrchestratorCommand = {
        type: CommandType.LAUNCH_APP,
        parameters: { bundleId: 'com.example.app1' },
        id: '123',
        description: 'Launch app 1'
      };

      const command2: IOrchestratorCommand = {
        type: CommandType.LAUNCH_APP,
        parameters: { bundleId: 'com.example.app2' },
        id: '456',
        description: 'Launch app 2'
      };

      mockIDBManager.launchApp.mockResolvedValue();

      await orchestrator.executeCommand(command1);
      await orchestrator.executeCommand(command2);
      
      const limitedHistory = orchestrator.getCommandHistory(1);
      expect(limitedHistory.length).toBe(1);
      expect(limitedHistory[0].command).toEqual(command2);
    });
  });

  describe('event handling', () => {
    it('should handle event listeners correctly', () => {
      const mockListener = jest.fn();
      const event = 'testEvent';
      const data = { test: true };

      // Add listener
      orchestrator.on(event, mockListener);
      orchestrator['emit'](event, data);
      expect(mockListener).toHaveBeenCalledWith(data);

      // Remove listener
      orchestrator.off(event, mockListener);
      orchestrator['emit'](event, data);
      expect(mockListener).toHaveBeenCalledTimes(1);
    });

    it('should emit session events', async () => {
      const sessionCreatedListener = jest.fn();
      orchestrator.on('sessionCreated', sessionCreatedListener);

      const command: IOrchestratorCommand = {
        type: CommandType.CREATE_SIMULATOR_SESSION,
        parameters: { udid: 'test-simulator' },
        id: '123',
        description: 'Create simulator session'
      };

      mockIDBManager.createSimulatorSession.mockResolvedValue('new-session-123');

      await orchestrator.executeCommand(command);
      expect(sessionCreatedListener).toHaveBeenCalledWith({ sessionId: 'new-session-123' });
    });
  });
});
